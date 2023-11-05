import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
import styles from "./header.module.css";
import {
  useAuthSession,
  useAuthSignout,
  useAuthSignin,
} from "~/routes/plugin@auth";
import avatar from "./icons/userAvatar.svg";
import SignOut from "./icons/signOut.svg?jsx";
import SignIn from "./icons/signIn.svg?jsx";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const session = useAuthSession();
  const signOut = useAuthSignout();
  const signIn = useAuthSignin();

  const location = useLocation();

  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/" title="qwik">
            <QwikLogo height={50} width={143} />
          </a>
        </div>
        <ul>
          <li class={[styles.user]}>
            {session.value?.user ? (
              <>
                <img
                  class={[styles.avatar]}
                  width="36"
                  height="36"
                  src={session.value.user.image ?? avatar}
                ></img>
                <span>{session.value.user.name}</span>
                <a
                  onClick$={() => {
                    signOut.submit({ callbackUrl: location.url.href });
                  }}
                  href="#"
                >
                  {/* @ts-ignore */}
                  <SignOut fill="lightgrey"></SignOut>
                </a>
              </>
            ) : (
              <>
                <a
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick$={() =>
                    signIn.submit({
                      providerId: "github",
                      options: { callbackUrl: location.url.href },
                    })
                  }
                  href="#"
                >
                  <span>Sign in &nbsp;</span>
                  {/* @ts-ignore */}
                  <SignIn fill="lightgrey"></SignIn>
                </a>
              </>
            )}
          </li>
          <li>
            <a
              href="https://qwik.builder.io/tutorial/welcome/overview/"
              target="_blank"
            >
              Tutorials
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
