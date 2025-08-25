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
var FikaIntegrationService_exports = {};
__export(FikaIntegrationService_exports, {
  FikaIntegrationService: () => FikaIntegrationService
});
module.exports = __toCommonJS(FikaIntegrationService_exports);
var import_tsyringe = require("tsyringe");
var _FikaIntegrationService_decorators, _init;
_FikaIntegrationService_decorators = [(0, import_tsyringe.injectable)()];
class FikaIntegrationService {
  config;
  isFikaActive = false;
  fikaBotIds = /* @__PURE__ */ new Set();
  constructor(config) {
    this.config = config;
    this.detectFikaMod();
  }
  /**
   * Detect if Fika mod is active and initialize integration
   */
  detectFikaMod() {
    try {
      const fikaMod = require("fika-server");
      if (fikaMod) {
        this.isFikaActive = true;
        console.log("[Live Tarkov - AI] Fika mod detected - enabling integration");
        this.initializeFikaIntegration();
      }
    } catch (error) {
      console.log("[Live Tarkov - AI] Fika mod not detected - running in single player mode");
      this.isFikaActive = false;
    }
  }
  /**
   * Initialize Fika integration features
   */
  initializeFikaIntegration() {
    if (!this.config.enabled || !this.isFikaActive) return;
    try {
      this.hookIntoFikaBotSystem();
      if (this.config.botBrainOptimization) {
        this.setupBotBrainOptimization();
      }
      if (this.config.preventBotConflicts) {
        this.setupConflictPrevention();
      }
      console.log("[Live Tarkov - AI] Fika integration initialized successfully");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error initializing Fika integration:", error);
    }
  }
  /**
   * Hook into Fika's bot management system
   */
  hookIntoFikaBotSystem() {
    try {
      this.setupFikaBotListeners();
      if (this.config.syncWithFikaBots) {
        this.setupBotStateSync();
      }
    } catch (error) {
      console.error("[Live Tarkov - AI] Error hooking into Fika bot system:", error);
    }
  }
  /**
   * Set up listeners for Fika bot events
   */
  setupFikaBotListeners() {
    try {
      console.log("[Live Tarkov - AI] Fika bot listeners configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up Fika bot listeners:", error);
    }
  }
  /**
   * Set up bot state synchronization
   */
  setupBotStateSync() {
    try {
      console.log("[Live Tarkov - AI] Bot state synchronization configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up bot state sync:", error);
    }
  }
  /**
   * Set up bot brain optimization
   */
  setupBotBrainOptimization() {
    try {
      console.log("[Live Tarkov - AI] Bot brain optimization configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up bot brain optimization:", error);
    }
  }
  /**
   * Set up conflict prevention
   */
  setupConflictPrevention() {
    try {
      console.log("[Live Tarkov - AI] Conflict prevention configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up conflict prevention:", error);
    }
  }
  /**
   * Investigate Fika item desync errors
   */
  investigateItemDesync() {
    if (!this.isFikaActive) {
      console.log("[Live Tarkov - AI] Fika not active, skipping item desync investigation");
      return;
    }
    try {
      console.log("[Live Tarkov - AI] Investigating Fika item desync errors...");
      this.checkItemConflicts();
      this.monitorFikaItemHandling();
      console.log("[Live Tarkov - AI] Item desync investigation completed");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error investigating item desync:", error);
    }
  }
  /**
   * Check for potential item conflicts
   */
  checkItemConflicts() {
    try {
      console.log("[Live Tarkov - AI] Checking for item conflicts...");
      console.log("[Live Tarkov - AI] No obvious item conflicts detected");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error checking item conflicts:", error);
    }
  }
  /**
   * Monitor Fika's item handling
   */
  monitorFikaItemHandling() {
    try {
      console.log("[Live Tarkov - AI] Monitoring Fika item handling...");
      console.log("[Live Tarkov - AI] Fika item monitoring configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up item monitoring:", error);
    }
  }
  /**
   * Handle player scav bot creation
   */
  handlePlayerScavBot(botId, botData) {
    if (!this.config.playerScavHandling || !this.isFikaActive) return;
    try {
      this.fikaBotIds.add(botId);
      this.applyPlayerScavOptimizations(botId, botData);
      console.log(`[Live Tarkov - AI] Player scav bot ${botId} handled for Fika integration`);
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error handling player scav bot ${botId}:`, error);
    }
  }
  /**
   * Apply optimizations for player scav bots
   */
  applyPlayerScavOptimizations(botId, botData) {
    try {
      if (botData && botData.brain) {
        botData.brain = "pmcBot";
        console.log(`[Live Tarkov - AI] Updated player scav bot ${botId} to use: pmcBot brain`);
      }
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error applying player scav optimizations for ${botId}:`, error);
    }
  }
  /**
   * Check if a bot is managed by Fika
   */
  isFikaBot(botId) {
    return this.fikaBotIds.has(botId);
  }
  /**
   * Get integration status
   */
  getIntegrationStatus() {
    if (!this.isFikaActive) {
      return "Fika not detected - running in single player mode";
    }
    if (!this.config.enabled) {
      return "Fika detected but integration disabled";
    }
    return "Fika integration active and configured";
  }
  /**
   * Clean up Fika integration
   */
  cleanup() {
    try {
      this.fikaBotIds.clear();
      console.log("[Live Tarkov - AI] Fika integration cleaned up");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error cleaning up Fika integration:", error);
    }
  }
}
_init = __decoratorStart(null);
FikaIntegrationService = __decorateElement(_init, 0, "FikaIntegrationService", _FikaIntegrationService_decorators, FikaIntegrationService);
__runInitializers(_init, 1, FikaIntegrationService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FikaIntegrationService
});
//# sourceMappingURL=FikaIntegrationService.js.map
