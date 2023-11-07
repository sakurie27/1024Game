import { defineConfig, loadEnv } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
process.env['LAUNCH_EDITOR'] = 'code'

export default defineConfig((env) => {
  const record = loadEnv('db', '.', [
    'ME', 'MONGO'
  ])
  // console.log(env.mode,record)
  return {
    define: {
      "ENABLE_DEBUG_LOGGING": 'true',
      "MONGODB_URL": `"${record.ME_CONFIG_MONGODB_URL.replace(/(\/\/(?:.*?@)?)(mongo)/, (_, g1) => {
        return g1 + record.MONGO_HOST
      })}"`
    },
    plugins: [
      qwikCity({

      }),
      qwikVite({

      }),
      tsconfigPaths(),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    server: {
      cors: {

      },
    },
    ssr: {

    }
  };
});
