import { ClientEvent, PlayerData, ServerEvent, ThemeName } from "shared";

class Network {
  private serverEvents: ServerEvent[];
  private clientEvents: ClientEvent[];
  private elapsed: number;
  private ws: WebSocket | undefined;

  public playerTheme: ThemeName;
  public enemyTheme: ThemeName;
  public me: string;

  constructor(private sendInterval = 0.2) {
    this.serverEvents = [];
    this.clientEvents = [];
    this.elapsed = 0;
    this.ws = undefined;
    this.me = "";
    this.playerTheme = "good";
    this.enemyTheme = "ugly";
  }

  update(dt: number) {
    this.elapsed += dt;
    if (this.elapsed >= this.sendInterval) {
      this.elapsed -= this.sendInterval;

      const clientEvents = this.clientEvents;
      this.clientEvents = [];

      clientEvents.forEach((ev) => {
        this.ws?.send(JSON.stringify(ev));
        // console.log(ev);
      });
    }
  }

  close() {
    this.ws?.close();
    this.ws = undefined;
    this.serverEvents = [];
    this.clientEvents = [];
    this.elapsed = 0;
  }

  send(ev: ClientEvent) {
    this.clientEvents.push(ev);
  }

  poll(onEvent: (ev: ServerEvent) => void) {
    while (this.serverEvents.length > 0) {
      const event = this.serverEvents.pop();
      if (event) {
        onEvent(event);
      }
    }
  }

  reconnect(address: string) {
    if (this.ws) {
      this.close();
    }

    const ws = new WebSocket(address);
    this.ws = ws;

    let time = Date.now();
    ws.onmessage = (ev) => {
      const current = Date.now();
      const dt = current - time;
      time = current;

      console.debug(`MSG: dt=${dt} data=${ev.data}`);
      const event = parseEvent(ev.data);

      if (event) {
        this.serverEvents.push(event);
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
  }
}

// I use global storage for network to simplify code
// I hope theuser can only have ONE SINGLE INSTANCE of the game running
export const networkState: Network = new Network();

function parseEvent(rawData: string) {
  try {
    return ServerEvent.parse(JSON.parse(rawData));
  } catch (err) {
    console.error("Cannot parse ev");
  }
  return undefined;
}
