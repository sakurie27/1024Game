import {
  component$,
  useComputed$,
  useResource$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./browse.module.css";
import { server$ } from "@builder.io/qwik-city";
import type { MediaPlayerClass } from "dashjs";
import { isServer } from "@builder.io/qwik/build";

const getRandomVideo = () => {};
export default component$(() => {
  const videoRef = useSignal<HTMLVideoElement>();

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
