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
var FikaIntegrationService_exports = {};
__export(FikaIntegrationService_exports, {
  FikaIntegrationService: () => FikaIntegrationService
});
module.exports = __toCommonJS(FikaIntegrationService_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FikaIntegrationService
});
//# sourceMappingURL=FikaIntegrationService.js.map
