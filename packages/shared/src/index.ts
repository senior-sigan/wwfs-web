export * from "./client-event";
export * from "./server-event";
export * from "./consts";

export type ThemeName = "ugly" | "good";
export const themeNames: ReadonlyArray<ThemeName> = ["good", "ugly"] as const;
