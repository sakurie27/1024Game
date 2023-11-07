import { defineConfig, loadEnv } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";
import tsconfigPaths from "vite-tsconfig-paths";
process.env["LAUNCH_EDITOR"] = "code";

export default defineConfig((env) => {
  const {
    NGINX_VOD_ROOT,
    NGINX_ORIGIN,
    MONGO_USERNAME: USER,
    MONGO_PASSWORD: PASSWD,
    MONGO_HOST: HOST,
  } = loadEnv("db", ".", [
    "ME",
    "MONGO",
    "NGINX",
  ]);
  // console.log(env.mode,record)
  return {
    define: {
      "NGINX_VOD_ROOT": JSON.stringify(NGINX_VOD_ROOT),
      "ENABLE_DEBUG_LOGGING": "true",
      "MONGODB_URL": `"mongodb://${USER}:${PASSWD}@${HOST}/"`
    },
    plugins: [
      qwikCity({}),
      qwikVite({}),
      tsconfigPaths(),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    server: {
      cors: {},
    },
    ssr: {},
  };
});
