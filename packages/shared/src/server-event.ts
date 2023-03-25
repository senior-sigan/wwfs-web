import { z } from "zod";

const ConnectionEvent = z.object({
  ev: z.literal("connection"),
  rid: z.string(),
  me: z.string(),
});
const StartedEvent = z.object({
  ev: z.literal("started"),
  rid: z.string(),
  me: z.string(),
  theme: z.enum(["good", "ugly"]),
});
const UpdateEvent = z.object({
  ev: z.literal("update"),
  rid: z.string(),
  me: z.string(),
  state: z.object({
    players: z.array(
      z.object({
        posX: z.number(),
        standing: z.boolean(),
        waterLevel: z.number(),
        plantLevel: z.number(),
        stunned: z.boolean(),
        fired: z.boolean(),
      })
    ),
  }),
});
const DisconnectEvent = z.object({
  ev: z.literal("disconnect"),
  rid: z.string(),
  other: z.string(),
  me: z.string(),
});
export const ServerEvent = z.discriminatedUnion("ev", [
  UpdateEvent,
  DisconnectEvent,
  ConnectionEvent,
  StartedEvent,
]);

export type ConnectionEvent = z.infer<typeof ConnectionEvent>;
export type StartedEvent = z.infer<typeof StartedEvent>;
export type UpdateEvent = z.infer<typeof UpdateEvent>;
export type DisconnectEvent = z.infer<typeof DisconnectEvent>;
export type ServerEvent = z.infer<typeof ServerEvent>;
