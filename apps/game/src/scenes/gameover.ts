import { Container } from "@pixi/display";
import { IScene, sceneManager, Timer } from "cat-lib";
import { loadThemes } from "../assets";
import { networkState } from "../networking";

export class GameOver implements IScene {
  timer: Timer;

  constructor(public container: Container) {
    this.timer = new Timer(60);
  }

  activate(): void {
    const themes = loadThemes();
    const theme = themes[networkState.playerTheme];
    this.container.addChild(theme.loseScreen);
    this.timer.reset();
    this.container.on("mousedown", () => {
      sceneManager.set("title");
    });
  }
  exit(): void {
    this.container.off("mousedown");
    this.container.removeChildren();
  }
  update(dt: number): void {
    if (this.timer.isPassed) {
      // TODO: handle mouse and keyboard click
      sceneManager.set("title");
    }
    this.timer.update(dt);
  }
}
