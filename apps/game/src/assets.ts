import { Assets, ResolverManifest } from "@pixi/assets";
import { sound } from "@pixi/sound";
import { Sprite } from "@pixi/sprite";

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
      ],
    },
  ],
};

function loadSound() {
  sound.add({
    bgm: "assets/sound/bgm.mp3",
    ricochet: "assets/sound/ricochet.mp3",
    shoot: "assets/sound/shoot.mp3",
    upsClipout: "assets/sound/ups_clipout.mp3",
    vodaIzVedra: "assets/sound/voda_iz_vedra.mp3",
    vodaV: "assets/sound/water_in.mp3",
  });
}

export async function loadAssets() {
  await Assets.init({ manifest, basePath: "/assets" });
  await Assets.loadBundle("load");
  Assets.backgroundLoadBundle("main");
  loadSound();
}

export type ThemePack = {
  hedge: Sprite;
  enemyHedge: Sprite;
  plant: Sprite[];
  background: Sprite;
  winScreen: Sprite;
  loseScreen: Sprite;
};

function get(name: string) {
  const tex = Assets.get(name);
  return new Sprite(tex);
}

export function loadThemes() {
  return {
    good: {
      hedge: get("goodHedge"),
      enemyHedge: get("goodEnemyHedge"),
      plant: [get("corn1"), get("corn2"), get("corn3")],
      background: get("mexico"),
      winScreen: get("win-screen-american"),
      loseScreen: get("lose-screen-american"),
    },
    ugly: {
      hedge: get("uglyHedge"),
      enemyHedge: get("uglyEnemyHedge"),
      plant: [get("tomatos1"), get("tomatos2"), get("tomatos3")],
      background: get("america"),
      winScreen: get("win-screen-mexico"),
      loseScreen: get("lose-screen-mexico"),
    },
  };
}
