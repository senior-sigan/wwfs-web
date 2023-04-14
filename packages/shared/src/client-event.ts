import { z } from "zod";

const MoveEvent = z.object({
  ev: z.literal("move"),
  dir: z.number(),
  standing: z.boolean(),
  dt: z.number(),
});
const FireEvent = z.object({
  ev: z.literal("fire"),
  mouseX: z.number(),
  mouseY: z.number(),
});
export const ClientEvent = z.discriminatedUnion("ev", [MoveEvent, FireEvent]);

export const ClientPackage = z.array(ClientEvent);

export type MoveEvent = z.infer<typeof MoveEvent>;
export type FireEvent = z.infer<typeof FireEvent>;
export type ClientEvent = z.infer<typeof ClientEvent>;
export type ClientPackage = z.infer<typeof ClientPackage>;
