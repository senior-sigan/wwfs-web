export const UI = {
  skyPosY: 91,

  enemyYRange: [652 - 415 - 80, 652 - 303 - 80] as const,
  enemyParallaxSpeed: 790,

  enemyBackYRange: [652 - 336 - 100, 652 - 336 - 175] as const,
  enemyBackParallaxSpeed: 500,

  myHedgeYRange: [652 - 320 + 31, 652 - 320 - 87] as const,
  myHedgeParallaxSpeed: 1100,

  groundYRange: [652 - 416 + 47, 652 - 416] as const,
  groundParallaxSpeed: 800,

  roadYRange: [652 - 64 - 257, 652 - 64 - 257] as const,
  roadParallaxSpeed: 800,

  enemyHedgeYRange: [652 - 136 - 247, 652 - 136 - 290] as const,
  enemyHedgeParallaxSpeed: 720,

  playerY: 652 - 10 - 360,
  playerMinX: 41,
  playerUpWH: [320, 360] as const,
  playerDownWH: [320, 300] as const,

  enemyUpWH: [80, 96] as const,
  enemyDownWH: [80, 96] as const,

  enemyUpPhysWH: [80, 96] as const,

  pumpPosition: [58, 14] as const,
  pumpEpsilon: 10,

  plantPos: [900, 9] as const,
  plantEpsilon: 10,

  hatSpeed: 600,
  upbarPos: [0, 581] as const,
  waterbarPos: [14, 14] as const,
};
