import { ServerEvent, ThemeName } from "shared";

export type NetworkState = {
  ws: WebSocket | undefined;
  events: ServerEvent[];
  theme: ThemeName;
};
// I use global storage for network to simplify code
// I hope theuser can only have ONE SINGLE INSTANCE of the game running
export const networkState: NetworkState = {
  ws: undefined,
  events: [],
  theme: "good",
};

export function Connect(address = "ws://localhost:3001") {
  if (networkState.ws) {
    networkState.ws.close();
  }
  networkState.events = [];

  const ws = new WebSocket(address);
  let time = Date.now();
  ws.onmessage = (ev) => {
    const current = Date.now();
    const dt = current - time;
    time = current;

    console.debug(`MSG: dt=${dt} data=${ev.data}`);
    const event = parseEvent(ev.data);

    if (event) {
      networkState.events.push(event);
    }
  };
  ws.onclose = () => {
    console.log("CLOSE");
    // TODO: handle!
  };
  ws.onopen = () => {
    console.log("OPEN");
    time = Date.now();
  };

  return ws;
}

function parseEvent(rawData: string) {
  try {
    return ServerEvent.parse(JSON.parse(rawData));
  } catch (err) {
    console.error("Cannot parse ev");
  }
  return undefined;
}
