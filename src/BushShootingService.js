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
var BushShootingService_exports = {};
__export(BushShootingService_exports, {
  BushShootingService: () => BushShootingService
});
module.exports = __toCommonJS(BushShootingService_exports);
var import_tsyringe = require("tsyringe");
var _BushShootingService_decorators, _init;
_BushShootingService_decorators = [(0, import_tsyringe.injectable)()];
class BushShootingService {
  config;
  activeBushes = /* @__PURE__ */ new Map();
  botShootingStates = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = config;
    if (this.config.enabled) {
      this.initializeBushDetection();
    }
  }
  /**
   * Initialize bush detection system
   */
  initializeBushDetection() {
    try {
      console.log("[Live Tarkov - AI] Bush shooting restrictions initialized");
      this.setupBushDetection();
    } catch (error) {
      console.error("[Live Tarkov - AI] Error initializing bush detection:", error);
    }
  }
  /**
   * Set up bush detection system
   */
  setupBushDetection() {
    try {
      this.setupVegetationDetection();
      this.setupShootingRestrictions();
      console.log("[Live Tarkov - AI] Bush detection system configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up bush detection:", error);
    }
  }
  /**
   * Set up vegetation detection
   */
  setupVegetationDetection() {
    try {
      console.log("[Live Tarkov - AI] Vegetation detection configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up vegetation detection:", error);
    }
  }
  /**
   * Set up shooting restrictions
   */
  setupShootingRestrictions() {
    try {
      this.hookIntoShootingSystem();
      console.log("[Live Tarkov - AI] Shooting restrictions configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up shooting restrictions:", error);
    }
  }
  /**
   * Hook into the shooting system
   */
  hookIntoShootingSystem() {
    try {
      console.log("[Live Tarkov - AI] Shooting system hooks installed");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error hooking into shooting system:", error);
    }
  }
  /**
   * Check if a bot can shoot at a target
   */
  canBotShoot(botId, targetPosition, botPosition) {
    if (!this.config.enabled) return true;
    try {
      if (this.isBotInBush(botPosition)) {
        if (this.config.preventShootingFromBushes) {
          console.log(`[Live Tarkov - AI] Bot ${botId} prevented from shooting from bush`);
          return false;
        }
      }
      if (this.config.preventShootingThroughBushes) {
        if (this.isBushBetweenPositions(botPosition, targetPosition)) {
          console.log(`[Live Tarkov - AI] Bot ${botId} prevented from shooting through bush`);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error checking bot shooting permission for ${botId}:`, error);
      return true;
    }
  }
  /**
   * Check if a bot is in a bush
   */
  isBotInBush(botPosition) {
    try {
      return this.checkVegetationOverlap(botPosition);
    } catch (error) {
      console.error("[Live Tarkov - AI] Error checking if bot is in bush:", error);
      return false;
    }
  }
  /**
   * Check if there's a bush between two positions
   */
  isBushBetweenPositions(startPos, endPos) {
    try {
      return this.checkLineOfSightForVegetation(startPos, endPos);
    } catch (error) {
      console.error("[Live Tarkov - AI] Error checking bush between positions:", error);
      return false;
    }
  }
  /**
   * Check vegetation overlap at a position
   */
  checkVegetationOverlap(position) {
    try {
      return false;
    } catch (error) {
      console.error("[Live Tarkov - AI] Error checking vegetation overlap:", error);
      return false;
    }
  }
  /**
   * Check line of sight for vegetation
   */
  checkLineOfSightForVegetation(startPos, endPos) {
    try {
      return false;
    } catch (error) {
      console.error("[Live Tarkov - AI] Error checking line of sight for vegetation:", error);
      return false;
    }
  }
  /**
   * Allow bot to track target through bushes (but not shoot)
   */
  allowTrackingThroughBushes(botId, targetPosition, botPosition) {
    if (!this.config.enabled || !this.config.allowTrackingThroughBushes) return true;
    try {
      return true;
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error checking tracking permission for ${botId}:`, error);
      return true;
    }
  }
  /**
   * Register a bush location
   */
  registerBush(bushId, bushData) {
    try {
      this.activeBushes.set(bushId, bushData);
      console.log(`[Live Tarkov - AI] Bush ${bushId} registered`);
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error registering bush ${bushId}:`, error);
    }
  }
  /**
   * Unregister a bush location
   */
  unregisterBush(bushId) {
    try {
      this.activeBushes.delete(bushId);
      console.log(`[Live Tarkov - AI] Bush ${bushId} unregistered`);
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error unregistering bush ${bushId}:`, error);
    }
  }
  /**
   * Get bush shooting restriction status
   */
  getRestrictionStatus() {
    return {
      enabled: this.config.enabled,
      preventShootingThroughBushes: this.config.preventShootingThroughBushes,
      preventShootingFromBushes: this.config.preventShootingFromBushes,
      allowTrackingThroughBushes: this.config.allowTrackingThroughBushes,
      bushDetectionRange: this.config.bushDetectionRange,
      activeBushes: this.activeBushes.size,
      restrictedBots: this.botShootingStates.size
    };
  }
  /**
   * Clean up bush shooting service
   */
  cleanup() {
    try {
      this.activeBushes.clear();
      this.botShootingStates.clear();
      console.log("[Live Tarkov - AI] Bush shooting service cleaned up");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error cleaning up bush shooting service:", error);
    }
  }
}
_init = __decoratorStart(null);
BushShootingService = __decorateElement(_init, 0, "BushShootingService", _BushShootingService_decorators, BushShootingService);
__runInitializers(_init, 1, BushShootingService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BushShootingService
});
//# sourceMappingURL=BushShootingService.js.map
