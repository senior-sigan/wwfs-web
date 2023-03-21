import { z } from "zod";

const MoveEvent = z.object({ ev: z.literal("move"), dir: z.number() });
const FireEvent = z.object({
  ev: z.literal("fire"),
  target: z.object({
    x: z.number(),
    y: z.number(),
  }),
});
export const Event = z.discriminatedUnion("ev", [MoveEvent, FireEvent]);

export type MoveEvent = z.infer<typeof MoveEvent>;
export type FireEvent = z.infer<typeof FireEvent>;
export type Event = z.infer<typeof Event>;
