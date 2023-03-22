import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IScene, sceneManager } from "cat-lib";
import { ServerEvent } from "shared";

function parseEvent(rawData: string) {
  try {
    return ServerEvent.parse(JSON.parse(rawData));
  } catch (err) {
    console.error("Cannot parse ev");
  }
  return undefined;
}

function network(oldWs: WebSocket | undefined, events: ServerEvent[]) {
  oldWs?.close();
  events.splice(0, events.length); // clear array

  const ws = new WebSocket("ws://localhost:3001");
  let time = Date.now();
  ws.onmessage = (ev) => {
    const current = Date.now();
    const dt = current - time;
    time = current;

    console.debug(`MSG: dt=${dt} data=${ev.data}`);
    const event = parseEvent(ev.data);

    if (event) events.push(event);
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

export class PairingScene implements IScene {
  ws: WebSocket | undefined;
  logo: Sprite;

  constructor(public container: Container, private events: ServerEvent[]) {
    this.ws = undefined;
    this.logo = Sprite.from("assets/textures/pairing_screen.png");
  }

  activate(): void {
    this.ws = network(this.ws, this.events);
    this.container.addChild(this.logo);
  }
  exit(): void {
    this.container.removeChild(this.logo);
  }
  update(_dt: number): void {
    while (this.events.length > 0) {
      const ev = this.events.pop();
      if (!ev) break;

      if (ev.ev === "started") {
        sceneManager.set("game");
      }
      if (ev.ev === "connection") {
        console.log("Waiting for players...");
      }
    }
  }
}
