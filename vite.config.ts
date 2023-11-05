import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";
import tsconfigPaths from "vite-tsconfig-paths";
process.env['LAUNCH_EDITOR'] = 'code'

export default defineConfig(() => {
  return {
    build: {

    },
    define: {
      "ENABLE_DEBUG_LOGGING": 'true',
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
