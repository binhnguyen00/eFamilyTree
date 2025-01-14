import appConfig from "../../app-config.json";

export function getAppConfig<T>(getter: (config: typeof appConfig) => T) {
  return getter(appConfig);
}