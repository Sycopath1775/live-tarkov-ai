var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var HotZoneManager_exports = {};
__export(HotZoneManager_exports, {
  HotZoneManager: () => HotZoneManager
});
module.exports = __toCommonJS(HotZoneManager_exports);
var import_tsyringe = require("tsyringe");
var _HotZoneManager_decorators, _init;
_HotZoneManager_decorators = [(0, import_tsyringe.injectable)()];
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
_init = __decoratorStart(null);
HotZoneManager = __decorateElement(_init, 0, "HotZoneManager", _HotZoneManager_decorators, HotZoneManager);
__runInitializers(_init, 1, HotZoneManager);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HotZoneManager
});
//# sourceMappingURL=HotZoneManager.js.map
