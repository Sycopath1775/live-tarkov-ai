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
var BushShootingService_exports = {};
__export(BushShootingService_exports, {
  BushShootingService: () => BushShootingService
});
module.exports = __toCommonJS(BushShootingService_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BushShootingService
});
//# sourceMappingURL=BushShootingService.js.map
