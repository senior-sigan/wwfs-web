import { Assets, ResolverManifest } from "@pixi/assets";
import { Rectangle, Texture } from "@pixi/core";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { sound } from "@pixi/sound";
import { Sprite } from "@pixi/sprite";
import { ThemeName } from "shared";
import { also } from "cat-lib";

const manifest: ResolverManifest = {
  bundles: [
    {
      name: "load",
      assets: [
        {
          name: "logo",
          srcs: "textures/logo.png",
        },
      ],
    },
    {
      name: "main",
      assets: [
        { name: "pairing_screen", srcs: "textures/pairing_screen.png" },
        { name: "player_good", srcs: "textures/player_good.png" },

        { name: "goodHedge", srcs: "textures/goodHedge.png" },
        { name: "goodEnemyHedge", srcs: "textures/goodEnemyHedge.png" },
        { name: "corn1", srcs: "textures/corn1.png" },
        { name: "corn2", srcs: "textures/corn2.png" },
        { name: "corn3", srcs: "textures/corn3.png" },
        { name: "mexico", srcs: "textures/mexico.png" },
        {
          name: "win-screen-american",
          srcs: "textures/win-screen-american.png",
        },
        {
          name: "lose-screen-american",
          srcs: "textures/lose-screen-american.png",
        },

        { name: "player_ugly", srcs: "textures/player_ugly.png" },
        { name: "uglyHedge", srcs: "textures/uglyHedge.png" },
        { name: "uglyEnemyHedge", srcs: "textures/uglyEnemyHedge.png" },
        { name: "tomatos1", srcs: "textures/tomatos1.png" },
        { name: "tomatos2", srcs: "textures/tomatos2.png" },
        { name: "tomatos3", srcs: "textures/tomatos3.png" },
        { name: "america", srcs: "textures/america.png" },
        {
          name: "win-screen-mexico",
          srcs: "textures/win-screen-mexico.png",
        },
        {
          name: "lose-screen-mexico",
          srcs: "textures/lose-screen-mexico.png",
        },
        { name: "ground", srcs: "textures/myGround.png" },
        { name: "road", srcs: "textures/road.png" },
        { name: "sky", srcs: "textures/sky.png" },
      ],
    },
  ],
};

function splitTexture(assetName: string, width: number, height: number) {
  const texture = Texture.from(assetName);
  const rows = Math.floor(texture.height / height);
  const columns = Math.floor(texture.width / width);
  const textures = new Array<Texture>();
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      const x = c * width;
      const y = r * height;
      const frame = new Rectangle(x, y, width, height);
      textures.push(new Texture(texture.baseTexture, frame));
    }
  }

  return textures;
}

function loadSound() {
  sound.add({
    bgm: "assets/sound/bgm.mp3",
    ricochet: "assets/sound/ricochet.mp3",
    shoot: "assets/sound/shoot.mp3",
    upsClipout: "assets/sound/ups_clipout.mp3",
    vodaIzVedra: "assets/sound/voda_iz_vedra.mp3",
    vodaV: "assets/sound/water_in.mp3",
  });
  // sound.play("bgm");
}

export async function loadAssets() {
  await Assets.init({ manifest, basePath: "/assets" });
  await Assets.loadBundle("load");
  Assets.backgroundLoadBundle("main");
  loadSound();
}

export type PlayerPack = {
  up: Sprite;
  down: Sprite;
  running: AnimatedSprite;
  shooting: AnimatedSprite;
  crawling: AnimatedSprite;
  killed: Sprite;
};
export type ThemePack = {
  player: PlayerPack;
  hedge: Sprite;
  enemyHedge: Sprite;
  plant: Sprite[];
  background: Sprite;
  winScreen: Sprite;
  loseScreen: Sprite;
  ground: Sprite;
  road: Sprite;
  sky: Sprite;
};

function playerSprites(assetName: string): PlayerPack {
  const textures = splitTexture(assetName, 320, 360);

  return {
    up: Sprite.from(textures[0]),
    down: Sprite.from(textures[1]),
    running: also(
      new AnimatedSprite([textures[0], textures[5], textures[6]]),
      (it) => (it.animationSpeed = 0.2)
    ),
    shooting: also(
      new AnimatedSprite([textures[0], textures[2], textures[0]]),
      (it) => (it.animationSpeed = 0.2)
    ),
    crawling: also(
      new AnimatedSprite([textures[1], textures[3], textures[4]]),
      (it) => (it.animationSpeed = 0.2)
    ),
    killed: Sprite.from(textures[7]),
  };
}

export function loadThemes(): Record<ThemeName, ThemePack> {
  return {
    good: {
      player: playerSprites("player_good"),
      hedge: Sprite.from("goodHedge"),
      enemyHedge: Sprite.from("goodEnemyHedge"),
      plant: [Sprite.from("corn1"), Sprite.from("corn2"), Sprite.from("corn3")],
      background: Sprite.from("mexico"),
      winScreen: Sprite.from("win-screen-american"),
      loseScreen: Sprite.from("lose-screen-american"),
      ground: Sprite.from("ground"),
      road: Sprite.from("road"),
      sky: Sprite.from("sky"),
    },
    ugly: {
      player: playerSprites("player_ugly"),
      hedge: Sprite.from("uglyHedge"),
      enemyHedge: Sprite.from("uglyEnemyHedge"),
      plant: [
        Sprite.from("tomatos1"),
        Sprite.from("tomatos2"),
        Sprite.from("tomatos3"),
      ],
      background: Sprite.from("america"),
      winScreen: Sprite.from("win-screen-mexico"),
      loseScreen: Sprite.from("lose-screen-mexico"),
      ground: Sprite.from("ground"),
      road: Sprite.from("road"),
      sky: Sprite.from("sky"),
    },
  };
}
