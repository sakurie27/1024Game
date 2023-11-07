import {
  component$,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import styles from "./browse.module.css";
import { isServer } from "@builder.io/qwik/build";

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
