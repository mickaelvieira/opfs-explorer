import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import swc from "@rollup/plugin-swc";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    name: "opfs-explorer",
    format: "es",
  },
  plugins: [
    swc({
      swc: {
        minify: true,
        env: {
          targets: {
            chrome: "113",
            firefox: "112",
          },
        },
      },
    }),
    resolve(),
    commonjs({
      extensions: [".ts"],
    }),
  ],
};
