import { Vec2 } from "cat-lib";

export const UI = {
  skyPosY: 91,

  enemyYRange: new Vec2(303, 415),
  enemyParallaxSpeed: 793,

  enemyBackYRange: new Vec2(100, 175),
  enemyBackParallaxSpeed: 500,

  myHedgeYRange: new Vec2(-31, 87),
  myHedgeParallaxSpeed: 1100,

  groundYRange: new Vec2(-47, 0),
  groundParallaxSpeed: 800,

  roadYRange: new Vec2(257, 257),
  roadParallaxSpeed: 800,

  enemyHedgeYRange: new Vec2(247, 290),
  enemyHedgeParallaxSpeed: 720,

  playerY: 10,
  playerMinX: 41,
  playerUpWH: new Vec2(320, 360),
  playerDownWH: new Vec2(320, 300),

  enemyY: 415,
  enemyUpWH: new Vec2(80, 96),
  enemyDownWH: new Vec2(80, 96),

  enemyUpPhysWH: new Vec2(80, 96),

  pumpPosition: new Vec2(58, 14),
  pumpEpsilon: 10,

  plantPos: new Vec2(900, 9),
  plantEpsilon: 10,

  hatSpeed: 600,
  upbarPos: new Vec2(0, 581),
  waterbarPos: new Vec2(14, 14),
};
