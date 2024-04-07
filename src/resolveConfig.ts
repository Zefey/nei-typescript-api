import path from "path";
import { cosmiconfigSync } from "cosmiconfig";

const getCosmiconfig = () => {
  const explorer = cosmiconfigSync("neiApi", {
    cache: true,
    transform: (result) => {
      if (result && result.config) {
        if (typeof result.config === "string") {
          const dir = path.dirname(result.filepath);
          const modulePath = require.resolve(result.config, { paths: [dir] });
          result.config = require(modulePath);
        }

        if (typeof result.config !== "object") {
          throw new Error(
            "Config is only allowed to be an object, " +
              `but received ${typeof result.config} in "${result.filepath}"`
          );
        }

        delete result.config.$schema;
      }
      return result;
    },
    searchPlaces: ["package.json", "neiApi.config.js"],
  });

  return explorer;
};

const getCosmiconfigPrivate = () => {
  const explorer = cosmiconfigSync("neiApi", {
    cache: true,
    transform: (result) => {
      if (result && result.config) {
        if (typeof result.config === "string") {
          const dir = path.dirname(result.filepath);
          const modulePath = require.resolve(result.config, { paths: [dir] });
          result.config = require(modulePath);
        }

        if (typeof result.config !== "object") {
          throw new Error(
            "Config is only allowed to be an object, " +
              `but received ${typeof result.config} in "${result.filepath}"`
          );
        }

        delete result.config.$schema;
      }
      return result;
    },
    searchPlaces: [".neiApi.json", ".neiApi"],
  });

  return explorer;
};

export const resolveConfig = () => {
  const { search } = getCosmiconfig();
  const { search: searchPrivate } = getCosmiconfigPrivate();
  const result = search();
  const resultPrivate = searchPrivate();
  return {
    ...result?.config,
    ...resultPrivate?.config,
  };
};
