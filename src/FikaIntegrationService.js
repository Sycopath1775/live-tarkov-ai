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
  configManager;
  botController;
  logger;
  fikaConfig;
  fikaAvailable = false;
  fikaService = null;
  constructor(configManager, botController, logger) {
    this.configManager = configManager;
    this.botController = botController;
    this.logger = logger;
  }
  initialize() {
    try {
      this.logger.info("[LiveTarkovAI] Initializing Fika integration...");
      this.fikaConfig = this.configManager.getFikaIntegrationConfig();
      if (this.fikaConfig.enabled) {
        this.checkFikaAvailability();
        if (this.fikaAvailable) {
          this.setupFikaIntegration();
          this.logger.info("[LiveTarkovAI] Fika integration initialized successfully");
        } else {
          this.logger.info("[LiveTarkovAI] Fika not available - integration disabled");
        }
      } else {
        this.logger.info("[LiveTarkovAI] Fika integration disabled in configuration");
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error initializing Fika integration: ${error}`);
    }
  }
  // Check if Fika mod is available
  checkFikaAvailability() {
    try {
      try {
        this.fikaService = require("fika-server");
        this.fikaAvailable = true;
        return;
      } catch (error) {
      }
      if (globalThis.FikaService || globalThis.FikaServerService || globalThis.fika) {
        this.fikaService = globalThis.FikaService || globalThis.FikaServerService || globalThis.fika;
        this.fikaAvailable = true;
        return;
      }
      try {
        if (globalThis.SPT_CONTAINER) {
          const container = globalThis.SPT_CONTAINER;
          if (container.resolve && container.resolve("FikaService")) {
            this.fikaService = container.resolve("FikaService");
            this.fikaAvailable = true;
            return;
          }
        }
      } catch (error) {
      }
      this.fikaAvailable = false;
    } catch (error) {
      this.fikaAvailable = false;
    }
  }
  // Setup Fika integration
  setupFikaIntegration() {
    try {
      if (!this.fikaService) return;
      this.applyFikaIntegrationFeatures();
      this.hookIntoFikaServices();
      this.logger.info("[LiveTarkovAI] Fika integration setup completed");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up Fika integration: ${error}`);
    }
  }
  // Apply Fika integration features
  applyFikaIntegrationFeatures() {
    try {
      if (this.fikaConfig.multiplayerCompatibility) {
        this.setupMultiplayerCompatibility();
      }
      if (this.fikaConfig.playerScavHandling) {
        this.setupPlayerScavHandling();
      }
      if (this.fikaConfig.botBrainOptimization) {
        this.setupBotBrainOptimization();
      }
      if (this.fikaConfig.preventBotConflicts) {
        this.setupBotConflictPrevention();
      }
      this.logger.info("[LiveTarkovAI] Fika integration features applied");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying Fika integration features: ${error}`);
    }
  }
  // Setup multiplayer compatibility
  setupMultiplayerCompatibility() {
    try {
      if (!this.fikaService || !this.fikaService.setupMultiplayerCompatibility) return;
      this.fikaService.setupMultiplayerCompatibility({
        syncBotStates: true,
        preventDesync: true,
        handleMultiplePlayers: true
      });
      this.logger.info("[LiveTarkovAI] Multiplayer compatibility configured with Fika");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up multiplayer compatibility: ${error}`);
    }
  }
  // Setup player scav handling
  setupPlayerScavHandling() {
    try {
      if (!this.fikaService || !this.fikaService.setupPlayerScavHandling) return;
      this.fikaService.setupPlayerScavHandling({
        preventBotConflicts: true,
        syncPlayerScavStates: true,
        handlePlayerScavSpawns: true
      });
      this.logger.info("[LiveTarkovAI] Player scav handling configured with Fika");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up player scav handling: ${error}`);
    }
  }
  // Setup bot brain optimization
  setupBotBrainOptimization() {
    try {
      if (!this.fikaService || !this.fikaService.setupBotBrainOptimization) return;
      this.fikaService.setupBotBrainOptimization({
        optimizePathfinding: true,
        reduceCPUUsage: true,
        improveBotIntelligence: true
      });
      this.logger.info("[LiveTarkovAI] Bot brain optimization configured with Fika");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up bot brain optimization: ${error}`);
    }
  }
  // Setup bot conflict prevention
  setupBotConflictPrevention() {
    try {
      if (!this.fikaService || !this.fikaService.setupBotConflictPrevention) return;
      this.fikaService.setupBotConflictPrevention({
        preventDuplicateSpawns: true,
        handleBotCollisions: true,
        manageBotTerritories: true
      });
      this.logger.info("[LiveTarkovAI] Bot conflict prevention configured with Fika");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up bot conflict prevention: ${error}`);
    }
  }
  // Hook into Fika services
  hookIntoFikaServices() {
    try {
      if (!this.fikaService) return;
      if (this.fikaService.botController) {
        this.hookIntoFikaBotController(this.fikaService.botController);
      }
      if (this.fikaService.spawnService) {
        this.hookIntoFikaSpawnService(this.fikaService.spawnService);
      }
      this.logger.info("[LiveTarkovAI] Successfully hooked into Fika services");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into Fika services: ${error}`);
    }
  }
  // Hook into Fika bot controller
  hookIntoFikaBotController(fikaBotController) {
    try {
      if (!fikaBotController || typeof fikaBotController !== "object") return;
      this.botController = fikaBotController;
      if (fikaBotController.getBots && typeof fikaBotController.getBots === "function") {
        const originalGetBots = fikaBotController.getBots;
        fikaBotController.getBots = () => {
          const bots = originalGetBots.call(fikaBotController);
          this.applyCustomBotModifications(bots);
          return bots;
        };
      }
      this.logger.info("[LiveTarkovAI] Successfully hooked into Fika bot controller");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into Fika bot controller: ${error}`);
    }
  }
  // Hook into Fika spawn service
  hookIntoFikaSpawnService(fikaSpawnService) {
    try {
      if (!fikaSpawnService || typeof fikaSpawnService !== "object") return;
      if (fikaSpawnService.spawnBot && typeof fikaSpawnService.spawnBot === "function") {
        const originalSpawnBot = fikaSpawnService.spawnBot;
        fikaSpawnService.spawnBot = async (botType, location, count) => {
          const modifiedCount = this.calculateCustomBotCount(botType, location, count);
          const modifiedBotType = this.getModifiedBotType(botType);
          return await originalSpawnBot.call(fikaSpawnService, modifiedBotType, location, modifiedCount);
        };
      }
      this.logger.info("[LiveTarkovAI] Successfully hooked into Fika spawn service");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into Fika spawn service: ${error}`);
    }
  }
  // Apply custom bot modifications
  applyCustomBotModifications(bots) {
    try {
      if (!Array.isArray(bots)) return;
      for (const bot of bots) {
        const config = this.configManager.getConfig();
        const botTypeConfig = config.botTypeSettings[bot.Role];
        if (botTypeConfig && botTypeConfig.enabled) {
          if (botTypeConfig.gearRestrictions) {
            this.applyGearRestrictions(bot, botTypeConfig.gearRestrictions);
          }
          if (botTypeConfig.liveTarkovBehavior) {
            this.applyBehaviorModifications(bot, botTypeConfig.liveTarkovBehavior);
          }
        }
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying custom bot modifications: ${error}`);
    }
  }
  // Apply gear restrictions to bot
  applyGearRestrictions(bot, gearRestrictions) {
    try {
      if (gearRestrictions.weapons && gearRestrictions.weapons.length > 0) {
        bot.weaponRestrictions = gearRestrictions.weapons;
      }
      if (gearRestrictions.armor && gearRestrictions.armor.length > 0) {
        bot.armorRestrictions = gearRestrictions.armor;
      }
      if (gearRestrictions.items && gearRestrictions.items.length > 0) {
        bot.itemRestrictions = gearRestrictions.items;
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying gear restrictions: ${error}`);
    }
  }
  // Apply behavior modifications to bot
  applyBehaviorModifications(bot, behavior) {
    try {
      if (behavior.accuracy !== void 0) {
        bot.accuracy = behavior.accuracy;
      }
      if (behavior.reactionTime !== void 0) {
        bot.reactionTime = behavior.reactionTime;
      }
      if (behavior.aggression !== void 0) {
        bot.aggression = behavior.aggression;
      }
      if (behavior.hearing !== void 0) {
        bot.hearing = behavior.hearing;
      }
      if (behavior.vision !== void 0) {
        bot.vision = behavior.vision;
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying behavior modifications: ${error}`);
    }
  }
  // Calculate custom bot count based on configuration
  calculateCustomBotCount(botType, location, originalCount) {
    try {
      const config = this.configManager.getConfig();
      const mapConfig = config.mapSettings[location];
      if (!mapConfig || !mapConfig.enabled) return originalCount;
      const botTypeConfig = mapConfig.botTypes[botType];
      if (!botTypeConfig || !botTypeConfig.enabled) return 0;
      return Math.min(botTypeConfig.maxCount, originalCount);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error calculating custom bot count: ${error}`);
      return originalCount;
    }
  }
  // Get modified bot type based on configuration
  getModifiedBotType(originalBotType) {
    try {
      return originalBotType;
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error getting modified bot type: ${error}`);
      return originalBotType;
    }
  }
  // Check if Fika integration is available
  isFikaAvailable() {
    return this.fikaAvailable;
  }
  // Get Fika configuration
  getFikaConfig() {
    return this.fikaConfig;
  }
  // Update Fika configuration
  updateFikaConfig(newConfig) {
    try {
      this.fikaConfig = { ...this.fikaConfig, ...newConfig };
      if (this.fikaConfig.enabled && this.fikaAvailable) {
        this.setupFikaIntegration();
        this.logger.info("[LiveTarkovAI] Fika configuration updated");
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error updating Fika configuration: ${error}`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FikaIntegrationService
});
//# sourceMappingURL=FikaIntegrationService.js.map
