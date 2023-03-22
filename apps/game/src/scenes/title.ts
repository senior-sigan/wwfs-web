import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IScene, sceneManager } from "cat-lib";

export class TitleScene implements IScene {
  constructor(public container: Container) {}

  activate(): void {
    console.log("Activate Title");
    const logo = Sprite.from("assets/textures/logo.png");
    logo.x = 0;
    logo.y = 0;
    this.container.addChild(logo);
  }
  exit(): void {
    console.log("Exit Active");
    this.container.removeChildren();
  }
  update(_dt: number): void {
    // nothing to do
    sceneManager.set("pairing");
  }
}
