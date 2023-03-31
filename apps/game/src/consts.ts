export const UI = {
  skyPosY: 91,

  enemyYRange: [303, 415] as const,
  enemyParallaxSpeed: 16,

  enemyBackYRange: [652 - 336 - 100, 652 - 336 - 175] as const,
  enemyBackParallaxSpeed: 10,

  myHedgeYRange: [652 - 320 + 31, 652 - 320 - 87] as const,
  myHedgeParallaxSpeed: 22,

  groundYRange: [652 - 416 + 47, 652 - 416] as const,
  groundParallaxSpeed: 16,

  roadYRange: [652 - 64 - 257, 652 - 64 - 257] as const,
  roadParallaxSpeed: 16,

  enemyHedgeYRange: [652 - 136 - 247, 652 - 136 - 290] as const,
  enemyHedgeParallaxSpeed: 14,

  playerY: 10,
  playerMinX: 41,
  playerUpWH: [320, 360] as const,
  playerDownWH: [320, 300] as const,

  enemyY: 415,
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
