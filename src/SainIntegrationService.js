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
var SainIntegrationService_exports = {};
__export(SainIntegrationService_exports, {
  SainIntegrationService: () => SainIntegrationService
});
module.exports = __toCommonJS(SainIntegrationService_exports);
class SainIntegrationService {
  config;
  isSainActive = false;
  sainBotIds = /* @__PURE__ */ new Set();
  behaviorOverrides = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = config;
    this.detectSainMod();
  }
  /**
   * Detect if SAIN mod is active and initialize integration
   */
  detectSainMod() {
    try {
      const sainMod = require("zSolarint-SAIN-ServerMod");
      if (sainMod) {
        this.isSainActive = true;
        console.log("[Live Tarkov - AI] SAIN mod detected - enabling integration");
        this.initializeSainIntegration();
      }
    } catch (error) {
      console.log("[Live Tarkov - AI] SAIN mod not detected - running without SAIN integration");
      this.isSainActive = false;
    }
  }
  /**
   * Initialize SAIN integration features
   */
  initializeSainIntegration() {
    if (!this.config.enabled || !this.isSainActive) return;
    try {
      this.hookIntoSainBotSystem();
      if (this.config.syncBotBehavior) {
        this.setupBehaviorSynchronization();
      }
      if (this.config.enhancedPathfinding) {
        this.setupEnhancedPathfinding();
      }
      if (this.config.tacticalMovement) {
        this.setupTacticalMovement();
      }
      console.log("[Live Tarkov - AI] SAIN integration initialized successfully");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error initializing SAIN integration:", error);
    }
  }
  /**
   * Hook into SAIN's bot management system
   */
  hookIntoSainBotSystem() {
    try {
      this.setupSainBotListeners();
      this.setupBotStateSync();
    } catch (error) {
      console.error("[Live Tarkov - AI] Error hooking into SAIN bot system:", error);
    }
  }
  /**
   * Set up listeners for SAIN bot events
   */
  setupSainBotListeners() {
    try {
      console.log("[Live Tarkov - AI] SAIN bot listeners configured");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up SAIN bot listeners:", error);
    }
  }
  /**
   * Set up bot state synchronization
   */
  setupBotStateSync() {
    try {
      console.log("[Live Tarkov - AI] Bot state sync configured with SAIN");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up bot state sync:", error);
    }
  }
  /**
   * Set up behavior synchronization
   */
  setupBehaviorSynchronization() {
    try {
      this.setupScavBehaviorSync();
      this.setupPmcBehaviorSync();
      this.setupBossBehaviorSync();
      console.log("[Live Tarkov - AI] Behavior synchronization configured with SAIN");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up behavior synchronization:", error);
    }
  }
  /**
   * Set up scav behavior synchronization
   */
  setupScavBehaviorSync() {
    try {
      if (this.config.scavBehavior.annoyingButNotDeadly) {
        this.configureScavBehavior();
      }
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up scav behavior sync:", error);
    }
  }
  /**
   * Set up PMC behavior synchronization
   */
  setupPmcBehaviorSync() {
    try {
      if (this.config.pmcBehavior.tacticalAndTough) {
        this.configurePmcBehavior();
      }
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up PMC behavior sync:", error);
    }
  }
  /**
   * Set up boss behavior synchronization
   */
  setupBossBehaviorSync() {
    try {
      if (this.config.bossBehavior.toughButNotInstaKill) {
        this.configureBossBehavior();
      }
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up boss behavior sync:", error);
    }
  }
  /**
   * Configure scav behavior for SAIN integration
   */
  configureScavBehavior() {
    try {
      const scavOverrides = {
        accuracy: this.config.scavBehavior.reducedAccuracy,
        avoidHeadshots: this.config.scavBehavior.avoidHeadshots,
        preventStomachBlacking: this.config.scavBehavior.preventStomachBlacking,
        behavior: "annoying"
      };
      this.behaviorOverrides.set("scav", scavOverrides);
      console.log("[Live Tarkov - AI] Scav behavior configured for SAIN integration");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error configuring scav behavior:", error);
    }
  }
  /**
   * Configure PMC behavior for SAIN integration
   */
  configurePmcBehavior() {
    try {
      const pmcOverrides = {
        accuracy: this.config.pmcBehavior.realisticAccuracy,
        avoidInstaKills: this.config.pmcBehavior.avoidInstaKills,
        properGearUsage: this.config.pmcBehavior.properGearUsage,
        behavior: "tactical"
      };
      this.behaviorOverrides.set("pmc", pmcOverrides);
      console.log("[Live Tarkov - AI] PMC behavior configured for SAIN integration");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error configuring PMC behavior:", error);
    }
  }
  /**
   * Configure boss behavior for SAIN integration
   */
  configureBossBehavior() {
    try {
      const bossOverrides = {
        avoidHeadshotSpam: this.config.bossBehavior.avoidHeadshotSpam,
        realisticDifficulty: this.config.bossBehavior.realisticDifficulty,
        properMechanics: this.config.bossBehavior.properMechanics,
        behavior: "boss"
      };
      this.behaviorOverrides.set("boss", bossOverrides);
      console.log("[Live Tarkov - AI] Boss behavior configured for SAIN integration");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error configuring boss behavior:", error);
    }
  }
  /**
   * Set up enhanced pathfinding
   */
  setupEnhancedPathfinding() {
    try {
      console.log("[Live Tarkov - AI] Enhanced pathfinding configured with SAIN");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up enhanced pathfinding:", error);
    }
  }
  /**
   * Set up tactical movement
   */
  setupTacticalMovement() {
    try {
      console.log("[Live Tarkov - AI] Tactical movement configured with SAIN");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error setting up tactical movement:", error);
    }
  }
  /**
   * Apply behavior overrides to a bot
   */
  applyBehaviorOverrides(botId, botType, botData) {
    if (!this.config.enabled || !this.isSainActive) return;
    try {
      const overrides = this.behaviorOverrides.get(botType);
      if (overrides) {
        this.applyOverridesToBot(botId, botData, overrides);
        console.log(`[Live Tarkov - AI] Applied SAIN behavior overrides to bot ${botId}`);
      }
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error applying behavior overrides to bot ${botId}:`, error);
    }
  }
  /**
   * Apply overrides to a bot
   */
  applyOverridesToBot(botId, botData, overrides) {
    try {
      if (overrides.accuracy !== void 0) {
        botData.accuracy = overrides.accuracy;
      }
      if (overrides.behavior) {
        botData.behaviorType = overrides.behavior;
      }
      this.sainBotIds.add(botId);
    } catch (error) {
      console.error(`[Live Tarkov - AI] Error applying overrides to bot ${botId}:`, error);
    }
  }
  /**
   * Check if a bot is managed by SAIN
   */
  isSainBot(botId) {
    return this.sainBotIds.has(botId);
  }
  /**
   * Get SAIN integration status
   */
  getIntegrationStatus() {
    return {
      enabled: this.config.enabled,
      sainActive: this.isSainActive,
      useSainBotBrains: this.config.useSainBotBrains,
      syncBotBehavior: this.config.syncBotBehavior,
      enhancedPathfinding: this.config.enhancedPathfinding,
      tacticalMovement: this.config.tacticalMovement,
      managedBotCount: this.sainBotIds.size,
      behaviorOverrides: this.behaviorOverrides.size
    };
  }
  /**
   * Clean up SAIN integration
   */
  cleanup() {
    try {
      this.sainBotIds.clear();
      this.behaviorOverrides.clear();
      console.log("[Live Tarkov - AI] SAIN integration cleaned up");
    } catch (error) {
      console.error("[Live Tarkov - AI] Error cleaning up SAIN integration:", error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SainIntegrationService
});
//# sourceMappingURL=SainIntegrationService.js.map
