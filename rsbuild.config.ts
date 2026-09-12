import { defineConfig, type Rspack } from "@rsbuild/core";
import { pluginHtmlMinifierTerser } from "rsbuild-plugin-html-minifier-terser";
import fs from "node:fs/promises";
import { pluginEjs } from "rsbuild-plugin-ejs";

const translations: Map<string, any> = new Map();
for (const file of (await fs.readdir("translations")).sort()) {
  if (file.length !== 5 || !file.endsWith(".ts")) {
    continue;
  }
  const mod = await import(`./translations/${file}`);
  translations.set(file.slice(0, 2), mod.default);
}

const entry: Record<string, string> = {
  index: "./src/redirect",
  404: "./src/404",
  ...Object.fromEntries(
    translations.keys().map((lang) => [lang, "./src/index"]),
  ),
};

export default defineConfig({
  source: { entry },
  html: {
    template: ({ entryName }) => `${entry[entryName]}.ejs`,
    title: "",
    templateParameters(defaultValue, { entryName }) {
      const language =
        entryName === "index" || entryName === "404" ? "en" : entryName;
      const compilation = defaultValue.compilation as Rspack.Compilation;
      return {
        ...defaultValue,
        translations,
        language,
        t: translations.get(language),
        asset(s: string): string {
          const assets = compilation.getAssets();
          const asset = assets.find((a) => a.info.sourceFilename === s);
          if (asset === undefined) {
            throw new Error(
              `asset not found: ${s}\n\nfound assets:\n${assets
                .map((a) => a.info.sourceFilename)
                .filter((v) => v !== undefined)
                .join("\n")}`,
            );
          }
          return asset.name;
        },
        assetsIn(s: string): string[] {
          const assets = compilation.getAssets();
          return assets
            .filter((a) => a.info.sourceFilename?.startsWith(s + "/"))
            .sort((a, b) =>
              a.info.sourceFilename == b.info.sourceFilename
                ? 0
                : a.info.sourceFilename! < b.info.sourceFilename!
                  ? -1
                  : 1,
            )
            .map((a) => a.name);
        },
      };
    },
  },
  plugins: [pluginHtmlMinifierTerser(), pluginEjs()],
  tools: {
    htmlPlugin(config, { entryName }) {
      if (entryName === "index") {
        config.scriptLoading = "blocking";
      }
    },
  },
});
