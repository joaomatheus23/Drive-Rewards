const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");
const projectModules = path.resolve(projectRoot, "node_modules");
const hoistedModules = path.resolve(monorepoRoot, "node_modules");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [projectModules, hoistedModules];

/** Prevent duplicate React / expo-modules-core in monorepo bundles. */
const singletonPrefixes = ["react/", "react-dom/", "expo-modules-core/"];
const singletonModules = new Set(["react", "react-dom", "react-native", "expo-modules-core"]);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton =
    singletonModules.has(moduleName) ||
    singletonPrefixes.some((prefix) => moduleName.startsWith(prefix));

  if (isSingleton) {
    try {
      return {
        filePath: require.resolve(moduleName, { paths: [hoistedModules] }),
        type: "sourceFile",
      };
    } catch {
      // fall through
    }
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
