import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const ReactCompilerConfig = {
  /* ... */
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["babel-plugin-react-compiler", ReactCompilerConfig],
      },
    }),
    tsconfigPaths(),
  ],
});
