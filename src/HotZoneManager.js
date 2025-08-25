var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var HotZoneManager_exports = {};
__export(HotZoneManager_exports, {
  HotZoneManager: () => HotZoneManager
});
module.exports = __toCommonJS(HotZoneManager_exports);
class HotZoneManager {
  constructor(configManager) {
    this.configManager = configManager;
    this.loadHotZoneConfig();
  }
  hotZoneConfig;
  activeSpawns = /* @__PURE__ */ new Map();
  spawnTimers = /* @__PURE__ */ new Map();
  loadHotZoneConfig() {
    try {
      this.hotZoneConfig = this.configManager.loadHotZoneConfig();
      console.log("[HotZoneManager] Hot zone configuration loaded successfully");
    } catch (error) {
      console.error("[HotZoneManager] Error loading hot zone config:", error);
      this.hotZoneConfig = this.getDefaultHotZoneConfig();
    }
  }
  getDefaultHotZoneConfig() {
    return {
      enabled: true,
      hotZones: {},
      spawnDistribution: {
        enabled: true,
        minDistanceBetweenSpawns: 100,
        maxSpawnsPerZone: 3,
        zonePriority: { high: 1, medium: 2, low: 3 },
        spawnTiming: {
          initialSpawnDelay: 30,
          waveSpacing: 300,
          randomization: 60
        }
      },
      integration: {
        waypointsMod: true,
        bigBrainMod: true,
        useExistingPathfinding: true,
        preventStuckBots: true
      }
    };
  }
  initializeHotZones(mapName) {
    if (!this.hotZoneConfig.enabled) {
      console.log("[HotZoneManager] Hot zones disabled");
      return;
    }
    const mapHotZones = this.hotZoneConfig.hotZones[mapName];
    if (!mapHotZones) {
      console.log(`[HotZoneManager] No hot zones configured for map: ${mapName}`);
      return;
    }
    console.log(`[HotZoneManager] Initializing hot zones for ${mapName}`);
    this.setupSpawnDistribution(mapName, mapHotZones);
    this.setupWaveSpawning(mapName, mapHotZones);
  }
  setupSpawnDistribution(mapName, hotZones) {
    const { spawnDistribution } = this.hotZoneConfig;
    if (!spawnDistribution.enabled) return;
    const sortedZones = Object.entries(hotZones).filter(([_, zone]) => zone.enabled).sort(
      ([_, a], [__, b]) => spawnDistribution.zonePriority[a.priority] - spawnDistribution.zonePriority[b.priority]
    );
    const spawnPositions = [];
    for (const [zoneName, zone] of sortedZones) {
      const positions = this.calculateSpawnPositions(
        zone,
        spawnPositions,
        spawnDistribution.minDistanceBetweenSpawns
      );
      spawnPositions.push(...positions.map((pos) => ({ zone: zoneName, position: pos })));
    }
    this.activeSpawns.set(mapName, spawnPositions);
    console.log(`[HotZoneManager] Calculated ${spawnPositions.length} spawn positions for ${mapName}`);
  }
  calculateSpawnPositions(zone, existingPositions, minDistance) {
    const positions = [];
    const maxAttempts = 50;
    let attempts = 0;
    while (positions.length < zone.maxBots && attempts < maxAttempts) {
      attempts++;
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * zone.coordinates.radius;
      const x = zone.coordinates.x + Math.cos(angle) * radius;
      const y = zone.coordinates.y + Math.sin(angle) * radius;
      const tooClose = existingPositions.some((existing) => {
        const distance = Math.sqrt(
          Math.pow(x - existing.position.x, 2) + Math.pow(y - existing.position.y, 2)
        );
        return distance < minDistance;
      });
      if (!tooClose) {
        positions.push({ x, y });
      }
    }
    return positions;
  }
  setupWaveSpawning(mapName, hotZones) {
    const { spawnTiming } = this.hotZoneConfig.spawnDistribution;
    const initialDelay = spawnTiming.initialSpawnDelay + Math.random() * spawnTiming.randomization;
    setTimeout(() => {
      this.executeInitialSpawns(mapName, hotZones);
    }, initialDelay * 1e3);
    this.setupWaveTimer(mapName, hotZones, spawnTiming.waveSpacing);
  }
  executeInitialSpawns(mapName, hotZones) {
    console.log(`[HotZoneManager] Executing initial spawns for ${mapName}`);
    for (const [zoneName, zone] of Object.entries(hotZones)) {
      if (!zone.enabled || Math.random() > zone.spawnChance) continue;
      const spawnPositions = this.activeSpawns.get(mapName) || [];
      const zonePositions = spawnPositions.filter((sp) => sp.zone === zoneName);
      this.spawnBotsInZone(zone, zonePositions, mapName);
    }
  }
  setupWaveTimer(mapName, hotZones, waveSpacing) {
    const timer = setInterval(() => {
      this.executeWaveSpawn(mapName, hotZones);
    }, waveSpacing * 1e3);
    this.spawnTimers.set(mapName, timer);
  }
  executeWaveSpawn(mapName, hotZones) {
    console.log(`[HotZoneManager] Executing wave spawn for ${mapName}`);
  }
  spawnBotsInZone(zone, positions, mapName) {
    console.log(`[HotZoneManager] Would spawn ${positions.length} ${zone.spawnTypes.join(", ")} bots in zone`);
  }
  cleanupMap(mapName) {
    const timer = this.spawnTimers.get(mapName);
    if (timer) {
      clearInterval(timer);
      this.spawnTimers.delete(mapName);
    }
    this.activeSpawns.delete(mapName);
    console.log(`[HotZoneManager] Cleaned up hot zones for ${mapName}`);
  }
  getHotZoneInfo(mapName) {
    const mapHotZones = this.hotZoneConfig.hotZones[mapName];
    if (!mapHotZones) return null;
    return {
      mapName,
      totalZones: Object.keys(mapHotZones).length,
      activeZones: Object.entries(mapHotZones).filter(([_, zone]) => zone.enabled).map(([name, zone]) => ({
        name,
        description: zone.description,
        priority: zone.priority,
        spawnTypes: zone.spawnTypes,
        maxBots: zone.maxBots
      }))
    };
  }
  isHotZoneEnabled(mapName) {
    return this.hotZoneConfig.enabled && !!this.hotZoneConfig.hotZones[mapName];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HotZoneManager
});
//# sourceMappingURL=HotZoneManager.js.map
