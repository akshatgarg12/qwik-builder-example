import { vercelEdgeAdaptor } from "@builder.io/qwik-city/adaptors/vercel-edge/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      minify: false,
      rollupOptions: {
        input: ["src/entry.vercel-edge.tsx", "@qwik-city-plan"],
      },
      outDir: ".vercel/output/functions/_qwik-city.func",
    },
    ssr: {
      target: "node",
      // noExternal : []
    },
    plugins: [
      vercelEdgeAdaptor({
        staticGenerate: true,
      }),
    ],
  };
});
