import {
  Resource,
  component$,
  useComputed$,
  useResource$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./browse.module.css";
import { useAuthSession } from "../plugin@auth";
import type { DashMeta } from "../api/user/[uid]/feed";
import { useLocation } from "@builder.io/qwik-city";
import { getUserFeed } from "../api/user/getUserFeed";
import Bottominfo from "~/components/video/BottomInfo";
import VolumeBar from "~/components/video/VolumeBar";

export default component$(() => {
  const session = useAuthSession();
  const location = useLocation();

  const videoIndex = useSignal(0);

  const all = useResource$<DashMeta[]>(
    async ({ track, cleanup, previous = [] }) => {
      track(() => videoIndex.value);
      const abort = new AbortController();
      cleanup(() => abort.abort());

      if (videoIndex.value + 4 > previous.length) {
        // const url = new URL(
        //   `/api/user/${session.value?.user?.name?.[0] ?? "_"}/feed`,
        //   location.url.origin,
        // );
        // const resp = await fetch(url);
        try {
          const suggest = await getUserFeed(abort.signal, "_", 6);
          const next = suggest.filter(
            (meta) => !previous.find((e: DashMeta) => e.bvid == meta.bvid),
          );

          if (next.length < 0) {
            alert("没有更多视频了哦");
          }

          return [...previous, ...next];
        } catch (e) {
          console.error(e);
        }
      }
      return previous;
    },
  );
  const startPos = useSignal<[number, number]>();
  const ptAction = useSignal<"seek" | "volume" | "switch">();
  const ptTrackingDone = useSignal<boolean>(false);
  const gapTime = 100;
  const volume = useSignal(100);
  // const seekDelta = useSignal(1);

  const audioUnlock = useSignal(false);
  const offsetCentage = useSignal<number>(0);

  const playingIndex = useComputed$(() => videoIndex.value % 3); // 0, 1, 2
  // 0:  0 + -  1 2 0   p = 0, 1, 2 -> 0,-1,+1
  // 1:  - 0 +==0 1 2 =     0, 1, 2 -> -1,0,+1
  // 2:  + - 0  2 0 1
  const currPos = useComputed$(() =>
    ((p: number) => [0, -1, +1, 0, -1, +1, 0].slice(p * 2, p * 2 + 3))(
      playingIndex.value,
    ),
  );

  useVisibleTask$(async ({ track, cleanup }) => {
    track(() => videoIndex.value);

    const video = document.getElementById(
      "vid" + playingIndex.value,
    ) as HTMLVideoElement;

    await video.play();
    cleanup(() => video.pause());
  });

  return (
    <div class={styles.box}>
      <VolumeBar
        visibility={ptAction.value == "volume" ? "visible" : "hidden"}
        position="absolute"
        right={"15%"}
        top={"15%"}
        bottom="auto"
        value={volume.value}
      ></VolumeBar>
      <Resource
        value={all}
        onResolved={(metas) => {
          return (
            <>
              <div
                class={styles.main}
                window:onmousedown$={async () => {
                  audioUnlock.value = true;
                }}
                window:onkeydown$={(e: KeyboardEvent) => {
                  console.log("Pressed", e.key);
                  switch (e.key) {
                    case "ArrowDown":
                      videoIndex.value += 1;
                      break;
                    case "ArrowUp":
                      videoIndex.value -= 1;
                      break;
                    case " ":
                      const video = document.getElementById(
                        `vid${playingIndex.value}`,
                      );
                      if (video instanceof HTMLVideoElement) {
                        video.paused ? video.play() : video.pause();
                      }
                  }
                }}
              >
                {[0, 1, 2].map((i) => (
                  <video
                    key={i}
                    id={"vid" + i}
                    playsInline
                    muted={!audioUnlock.value}
                    loop
                    style={{
                      transform: `translate(0, ${
                        currPos.value[i] * 100 + offsetCentage.value
                      }%);`,
                    }}
                    onPointerDown$={(e) => {
                      startPos.value = [e.clientX, e.clientY];
                    }}
                    onPointerMove$={(e) => {
                      // if pressed down
                      if (startPos.value) {
                        if (ptTrackingDone.value == false) {
                          setTimeout(() => {
                            ptTrackingDone.value = true;
                          }, gapTime);
                        } else {
                          const [x0, y0] = startPos.value!;
                          const dy = e.clientY - y0;
                          const dx = e.clientX - x0;

                          ptAction.value =
                            ptAction.value ?? Math.abs(dy) - Math.abs(dx) > 0
                              ? "switch"
                              : "seek";
                          switch (ptAction.value) {
                            case "seek":
                              return;
                            case "switch":
                              const el = e.target as HTMLElement;
                              let fact = 1;
                              if (videoIndex.value == 0 && dy > 0) {
                                // simply slow down switching
                                fact = Math.max(0, 1 - dy / 800);
                              }
                              const offsetDistance = dy * fact;
                              // if we are at the top and drag down~
                              offsetCentage.value =
                                (offsetDistance / el.clientHeight) * 80;
                              return;
                          }
                        }
                      }
                    }}
                    onPointerUp$={(e) => {
                      if (ptTrackingDone.value || ptAction.value) {
                        console.log(offsetCentage.value);
                        ptTrackingDone.value = false;
                        if (offsetCentage.value < -24) {
                          videoIndex.value = videoIndex.value + 1;
                          console.log("jump forward", videoIndex.value);
                        }
                        if (offsetCentage.value > 24 && videoIndex.value > 0) {
                          videoIndex.value = videoIndex.value - 1;
                          console.log("jump backward", videoIndex.value);
                        }
                      } else {
                        const video = e.target;
                        if (video instanceof HTMLVideoElement) {
                          if (video.paused) {
                            video.play();
                          } else {
                            video.pause();
                          }
                        }
                      }

                      offsetCentage.value = 0;
                      ptAction.value = undefined;
                      startPos.value = undefined;
                    }}
                  >
                    <source
                      src={metas[videoIndex.value + i].dash}
                      type="application/dash+xml"
                    />
                  </video>
                ))}
              </div>
              <Bottominfo meta={metas[videoIndex.value]} />
            </>
          );
        }}
      />
      <button
        class={styles.fab}
        onClick$={() => {
          videoIndex.value += 1;
        }}
      ></button>
    </div>
  );
});
