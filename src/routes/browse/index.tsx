import {
  Resource,
  component$,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import styles from "./browse.module.css";
import { isServer } from "@builder.io/qwik/build";
import { useAuthSession } from "../plugin@auth";
import type { DashMeta } from "../api/user/[uid]/feed";
import { Avatar, Box, Grid, IconButton, Typography } from "~/components/widgets";
import { useLocation } from "@builder.io/qwik-city";
import { getUserFeed } from "../api/user/getUserFeed";
import Bottominfo from "~/components/video/BottomInfo";

export default component$(() => {
  const videoRef = useSignal<HTMLVideoElement>();
  const session = useAuthSession();
  const location = useLocation();

  const videoIndex = useSignal(0);
  const count = useSignal(0);

  const all = useResource$<DashMeta[]>(
    async ({ track, cleanup, previous = [] }) => {
      track(() => videoIndex.value + 3 > count.value);

      const abort = new AbortController();
      cleanup(() => abort.abort());

      const url = new URL(
        `/api/user/${session.value?.user?.name?.[0] ?? "_"}/feed`,
        location.url.origin,
      );
      const resp = await fetch(url);
      try {
        if (resp.ok) {
          const suggest = await getUserFeed(abort.signal, "_", 4);
          const next = suggest.filter(
            (meta) => !previous.find((e: DashMeta) => e.bvid == meta.bvid),
          );

          count.value += next.length;

          return [...previous, ...next];
        }
      } catch (e) {
        console.error(e);
      }
      return [];
    },
  );

  const player = useResource$(async ({ track }) => {
    track(() => isServer);
    if (videoRef.value && !isServer) {
      const { MediaPlayer } = await import("dashjs");
      const player = MediaPlayer().create();

      player.initialize(
        videoRef.value,
        "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
        false,
      );

      return player;
    }
  });
  return (
    <div class={styles.box}>
      <Resource
        value={all}
        onResolved={(metas) => {
          const meta = metas[0];
          return (
            <Bottominfo meta={meta}/>
          );
        }}
      />
      <video ref={videoRef} class={styles.main}></video>
      <button
        class={styles.fab}
        onClick$={() => {
          player.value;
          videoRef.value?.play();
        }}
      ></button>
    </div>
  );
});
