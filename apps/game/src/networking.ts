import { Cooldown } from "cat-lib";
import { ClientEvent, ServerEvent, ThemeName } from "shared";

class Network {
  private serverEvents: ServerEvent[];
  private clientEvents: ClientEvent[];
  private ws: WebSocket | undefined;

  public playerTheme: ThemeName;
  public enemyTheme: ThemeName;
  // TODO: this valuas are lazily set in the pairing screen
  //   maybe set it here to avoid unmanaged state changes?
  public me: string;
  public rid: string;

  private sendCooldown: Cooldown;

  constructor(sendInterval: number) {
    this.serverEvents = [];
    this.clientEvents = [];
    this.sendCooldown = new Cooldown(sendInterval);
    this.ws = undefined;
    this.me = "";
    this.rid = "";
    this.playerTheme = "good";
    this.enemyTheme = "ugly";
  }

  update(dt: number) {
    if (this.sendCooldown.invoke()) {
      const clientEvents = this.clientEvents;
      this.clientEvents = [];

      clientEvents.forEach((ev) => {
        this.ws?.send(JSON.stringify(ev));
      });
    }

    this.sendCooldown.update(dt);
  }

  close() {
    this.ws?.close();
    this.ws = undefined;
    this.serverEvents = [];
    this.clientEvents = [];
    this.sendCooldown.reset();
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

    ws.onmessage = (ev) => {
      const event = parseEvent(ev.data);
      if (event) {
        this.serverEvents.push(event);
      }
    };
    ws.onclose = () => {
      console.log("WS_CLOSE");
      this.serverEvents.push({
        ev: "close",
        me: this.me,
        rid: this.rid,
      });
    };
    ws.onopen = () => {
      console.log("WS_OPEN");
    };
  }
}

// I use global storage for network to simplify code
// I hope theuser can only have ONE SINGLE INSTANCE of the game running
export const networkState: Network = new Network(1 / 30);

function parseEvent(rawData: string) {
  try {
    return ServerEvent.parse(JSON.parse(rawData));
  } catch (err) {
    console.error("Cannot parse ev");
  }
  return undefined;
}
