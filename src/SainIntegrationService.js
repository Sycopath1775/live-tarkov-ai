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
  configManager;
  botModificationService;
  logger;
  sainConfig;
  sainAvailable = false;
  sainService = null;
  constructor(configManager, botModificationService, logger) {
    this.configManager = configManager;
    this.botModificationService = botModificationService;
    this.logger = logger;
  }
  initialize() {
    try {
      this.logger.info("[LiveTarkovAI] Initializing SAIN integration...");
      this.sainConfig = this.configManager.getSainIntegrationConfig();
      if (this.sainConfig.enabled) {
        this.checkSAINAvailability();
        if (this.sainAvailable) {
          this.setupSAINIntegration();
          this.logger.info("[LiveTarkovAI] SAIN integration initialized successfully");
        } else {
          this.logger.info("[LiveTarkovAI] SAIN not available - integration disabled");
        }
      } else {
        this.logger.info("[LiveTarkovAI] SAIN integration disabled in configuration");
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error initializing SAIN integration: ${error}`);
    }
  }
  // Check if SAIN mod is available
  checkSAINAvailability() {
    try {
      try {
        this.sainService = require("zSolarint-SAIN-ServerMod");
        this.sainAvailable = true;
        return;
      } catch (error) {
      }
      if (globalThis.SAIN || globalThis.SainService || globalThis.sain) {
        this.sainService = globalThis.SAIN || globalThis.SainService || globalThis.sain;
        this.sainAvailable = true;
        return;
      }
      try {
        if (globalThis.SPT_CONTAINER) {
          const container = globalThis.SPT_CONTAINER;
          if (container.resolve && container.resolve("SAINService")) {
            this.sainService = container.resolve("SAINService");
            this.sainAvailable = true;
            return;
          }
        }
      } catch (error) {
      }
      this.sainAvailable = false;
    } catch (error) {
      this.sainAvailable = false;
    }
  }
  // Setup SAIN integration
  setupSAINIntegration() {
    try {
      if (!this.sainService) return;
      this.applySAINBehaviorModifications();
      this.hookIntoSAINServices();
      this.logger.info("[LiveTarkovAI] SAIN integration setup completed");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up SAIN integration: ${error}`);
    }
  }
  // Apply SAIN behavior modifications
  applySAINBehaviorModifications() {
    try {
      const config = this.configManager.getConfig();
      if (this.sainConfig.scavBehavior) {
        this.applyScavBehaviorModifications();
      }
      if (this.sainConfig.pmcBehavior) {
        this.applyPMCBehaviorModifications();
      }
      if (this.sainConfig.bossBehavior) {
        this.applyBossBehaviorModifications();
      }
      this.logger.info("[LiveTarkovAI] SAIN behavior modifications applied");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying SAIN behavior modifications: ${error}`);
    }
  }
  // Apply scav behavior modifications
  applyScavBehaviorModifications() {
    try {
      const scavBehavior = this.sainConfig.scavBehavior;
      if (scavBehavior.annoyingButNotDeadly) {
        this.modifyScavBehavior("annoying_but_not_deadly", {
          accuracy: scavBehavior.reducedAccuracy || 0.4,
          avoidHeadshots: scavBehavior.avoidHeadshots || true,
          preventStomachBlacking: scavBehavior.preventStomachBlacking || true
        });
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying scav behavior modifications: ${error}`);
    }
  }
  // Apply PMC behavior modifications
  applyPMCBehaviorModifications() {
    try {
      const pmcBehavior = this.sainConfig.pmcBehavior;
      if (pmcBehavior.tacticalAndTough) {
        this.modifyPMCBehavior("tactical_and_tough", {
          accuracy: pmcBehavior.realisticAccuracy || 0.75,
          avoidInstaKills: pmcBehavior.avoidInstaKills || true,
          properGearUsage: pmcBehavior.properGearUsage || true
        });
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying PMC behavior modifications: ${error}`);
    }
  }
  // Apply boss behavior modifications
  applyBossBehaviorModifications() {
    try {
      const bossBehavior = this.sainConfig.bossBehavior;
      if (bossBehavior.toughButNotInstaKill) {
        this.modifyBossBehavior("tough_but_not_insta_kill", {
          avoidHeadshotSpam: bossBehavior.avoidHeadshotSpam || true,
          realisticDifficulty: bossBehavior.realisticDifficulty || true,
          properMechanics: bossBehavior.properMechanics || true
        });
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying boss behavior modifications: ${error}`);
    }
  }
  // Modify scav behavior using SAIN
  modifyScavBehavior(behaviorType, modifications) {
    try {
      if (!this.sainService || !this.sainService.modifyScavBehavior) return;
      this.sainService.modifyScavBehavior(behaviorType, modifications);
      this.logger.info(`[LiveTarkovAI] Applied ${behaviorType} scav behavior through SAIN`);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error modifying scav behavior through SAIN: ${error}`);
    }
  }
  // Modify PMC behavior using SAIN
  modifyPMCBehavior(behaviorType, modifications) {
    try {
      if (!this.sainService || !this.sainService.modifyPMCBehavior) return;
      this.sainService.modifyPMCBehavior(behaviorType, modifications);
      this.logger.info(`[LiveTarkovAI] Applied ${behaviorType} PMC behavior through SAIN`);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error modifying PMC behavior through SAIN: ${error}`);
    }
  }
  // Modify boss behavior using SAIN
  modifyBossBehavior(behaviorType, modifications) {
    try {
      if (!this.sainService || !this.sainService.modifyBossBehavior) return;
      this.sainService.modifyBossBehavior(behaviorType, modifications);
      this.logger.info(`[LiveTarkovAI] Applied ${behaviorType} boss behavior through SAIN`);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error modifying boss behavior through SAIN: ${error}`);
    }
  }
  // Hook into SAIN services
  hookIntoSAINServices() {
    try {
      if (!this.sainService) return;
      if (this.sainService.botModificationService) {
        this.hookIntoSAINBotModification(this.sainService.botModificationService);
      }
      if (this.sainService.spawnService) {
        this.hookIntoSAINSpawnService(this.sainService.spawnService);
      }
      this.logger.info("[LiveTarkovAI] Successfully hooked into SAIN services");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into SAIN services: ${error}`);
    }
  }
  // Hook into SAIN bot modification service
  hookIntoSAINBotModification(sainBotModService) {
    try {
      if (!sainBotModService || typeof sainBotModService !== "object") return;
      this.botModificationService = sainBotModService;
      if (sainBotModService.modifyBot && typeof sainBotModService.modifyBot === "function") {
        const originalModifyBot = sainBotModService.modifyBot;
        sainBotModService.modifyBot = (bot, modifications) => {
          this.applyCustomBotModifications(bot, modifications);
          return originalModifyBot.call(sainBotModService, bot, modifications);
        };
      }
      this.logger.info("[LiveTarkovAI] Successfully hooked into SAIN bot modification service");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into SAIN bot modification service: ${error}`);
    }
  }
  // Hook into SAIN spawn service
  hookIntoSAINSpawnService(sainSpawnService) {
    try {
      if (!sainSpawnService || typeof sainSpawnService !== "object") return;
      if (sainSpawnService.spawnBot && typeof sainSpawnService.spawnBot === "function") {
        const originalSpawnBot = sainSpawnService.spawnBot;
        sainSpawnService.spawnBot = async (botType, location, count) => {
          const modifiedCount = this.calculateCustomBotCount(botType, location, count);
          const modifiedBotType = this.getModifiedBotType(botType);
          return await originalSpawnBot.call(sainSpawnService, modifiedBotType, location, modifiedCount);
        };
      }
      this.logger.info("[LiveTarkovAI] Successfully hooked into SAIN spawn service");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into SAIN spawn service: ${error}`);
    }
  }
  // Apply custom bot modifications
  applyCustomBotModifications(bot, modifications) {
    try {
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
  // Check if SAIN integration is available
  isSAINAvailable() {
    return this.sainAvailable;
  }
  // Get SAIN configuration
  getSAINConfig() {
    return this.sainConfig;
  }
  // Update SAIN configuration
  updateSAINConfig(newConfig) {
    try {
      this.sainConfig = { ...this.sainConfig, ...newConfig };
      if (this.sainConfig.enabled && this.sainAvailable) {
        this.setupSAINIntegration();
        this.logger.info("[LiveTarkovAI] SAIN configuration updated");
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error updating SAIN configuration: ${error}`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SainIntegrationService
});
//# sourceMappingURL=SainIntegrationService.js.map
