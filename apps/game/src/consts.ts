export const UI = {
  skyPosY: 91,

  enemyYRange: [652 - 415 - 80, 652 - 303 - 80],
  enemyParallaxSpeed: 790,

  enemyBackYRange: [652 - 336 - 100, 652 - 336 - 175],
  enemyBackParallaxSpeed: 500,

  myHedgeYRange: [652 - 320 + 20, 652 - 320 - 87],
  myHedgeParallaxSpeed: 1100,

  groundYRange: [652 - 416 + 47, 652 - 416],
  groundParallaxSpeed: 800,

  roadYRange: [652 - 64 - 257, 652 - 64 - 257],
  roadParallaxSpeed: 800,

  enemyHedgeYRange: [652 - 136 - 247, 652 - 136 - 290],
  enemyHedgeParallaxSpeed: 720,

  playerY: 652 - 10 - 360,
  playerMinX: 41,
  playerUpWH: [320, 360],
  playerDownWH: [320, 300],

  enemyUpWH: [80, 96],
  enemyDownWH: [80, 96],

  enemyUpPhysWH: [80, 96],

  pumpPosition: { x: 58, y: 320 },
  pumpEpsilon: 10,

  plantPos: { x: 820, y: 150 },
  plantEpsilon: 10,

  hatSpeed: 600,

  upBarSize: { w: 248, h: 24 },
  upBarMyPos: { x: 80, y: 34 },
  upBarEnemyPos: { x: 816, y: 34 },

  waterbarPos: { x: 14, y: 355 },
  waterBarSize: { w: 24, h: 244 },
  waterColor: 0x1a7ad4,
} as const;
