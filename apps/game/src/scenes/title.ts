import { Assets } from "@pixi/assets";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IScene, sceneManager } from "cat-lib";

export class TitleScene implements IScene {
  private ready = false;

  constructor(public container: Container) {}

  activate(): void {
    Assets.load("logo").then((tex) => {
      const logo = Sprite.from(tex);
      logo.x = 0;
      logo.y = 0;
      logo.scale = { x: 16, y: 16 };
      this.container.addChild(logo);
    });
    Assets.loadBundle("main").then(() => {
      this.ready = true;
    });
  }
  exit(): void {
    this.container.removeChildren();
  }
  update(_dt: number): void {
    // nothing to do
    if (this.ready) {
      sceneManager.set("pairing");
    }
  }
}
