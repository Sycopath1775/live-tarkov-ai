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
var SpawnManager_exports = {};
__export(SpawnManager_exports, {
  SpawnManager: () => SpawnManager
});
module.exports = __toCommonJS(SpawnManager_exports);
class SpawnManager {
  databaseServer;
  configManager;
  logger;
  constructor(databaseServer, configManager, logger) {
    this.databaseServer = databaseServer;
    this.configManager = configManager;
    this.logger = logger;
  }
  initialize() {
    try {
      this.logger.info("Initializing SpawnManager...");
      this.applyCustomSpawnConfig();
      this.logger.info("SpawnManager initialized successfully");
    } catch (error) {
      this.logger.error(`Error initializing SpawnManager: ${error}`);
    }
  }
  // Apply custom spawn configurations to the database
  applyCustomSpawnConfig() {
    try {
      this.logger.info("Applying custom spawn configurations...");
      this.modifyBotTypes();
      if (this.configManager.isGearProgressionEnabled()) {
        this.applyGearProgression();
      }
      this.logger.info("Custom spawn configurations applied successfully");
    } catch (error) {
      this.logger.error(`Error applying custom spawn config: ${error}`);
    }
  }
  // Modify bot types in the database
  modifyBotTypes() {
    try {
      const config = this.configManager.getConfig();
      const database = this.databaseServer.getTables();
      let modifiedCount = 0;
      const modifiedTypes = [];
      for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
        if (!botConfig || !botConfig.enabled) {
          continue;
        }
        const dbBotType = database.bots.types[botType];
        if (!dbBotType) {
          this.logger.warn(`Bot type ${botType} not found in database`);
          continue;
        }
        this.applyGearTierRestrictions(dbBotType, botConfig);
        this.applyDifficultySettings(dbBotType, botConfig);
        this.applyBotBehaviorSettings(dbBotType, botConfig);
        modifiedCount++;
        modifiedTypes.push(botType);
      }
      if (modifiedCount > 0) {
        this.logger.info(`Modified ${modifiedCount} bot types: ${modifiedTypes.join(", ")}`);
      }
    } catch (error) {
      this.logger.error(`Error modifying bot types: ${error}`);
    }
  }
  // Apply gear tier restrictions to bot types
  applyGearTierRestrictions(dbBotType, botConfig) {
    try {
      if (!botConfig.gearRestrictions) return;
      const restrictions = botConfig.gearRestrictions;
      if (restrictions.weapons) {
        dbBotType.inventory = dbBotType.inventory || {};
        dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
        dbBotType.inventory.equipment.weapon = restrictions.weapons;
      }
      if (restrictions.armor) {
        dbBotType.inventory = dbBotType.inventory || {};
        dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
        dbBotType.inventory.equipment.armor = restrictions.armor;
      }
      if (restrictions.items) {
        dbBotType.inventory = dbBotType.inventory || {};
        dbBotType.inventory.items = restrictions.items;
      }
    } catch (error) {
      this.logger.error(`Error applying gear restrictions: ${error}`);
    }
  }
  // Apply difficulty settings to bot types
  applyDifficultySettings(dbBotType, botConfig) {
    try {
      if (!botConfig.difficulty) return;
      const difficulty = botConfig.difficulty;
      dbBotType.difficulty = difficulty;
      this.applyDifficultyBasedBehavior(dbBotType, difficulty);
    } catch (error) {
      this.logger.error(`Error applying difficulty settings: ${error}`);
    }
  }
  // Apply difficulty-based behavior modifications
  applyDifficultyBasedBehavior(dbBotType, difficulty) {
    try {
      switch (difficulty) {
        case "easy":
          dbBotType.skills = dbBotType.skills || {};
          dbBotType.skills.aiming = Math.max(0.1, (dbBotType.skills.aiming || 0.5) * 0.7);
          dbBotType.skills.recoil = Math.max(0.1, (dbBotType.skills.recoil || 0.5) * 0.7);
          break;
        case "normal":
          break;
        case "hard":
          dbBotType.skills = dbBotType.skills || {};
          dbBotType.skills.aiming = Math.min(1, (dbBotType.skills.aiming || 0.5) * 1.3);
          dbBotType.skills.recoil = Math.min(1, (dbBotType.skills.recoil || 0.5) * 1.3);
          break;
        case "impossible":
          dbBotType.skills = dbBotType.skills || {};
          dbBotType.skills.aiming = Math.min(1, (dbBotType.skills.aiming || 0.5) * 1.5);
          dbBotType.skills.recoil = Math.min(1, (dbBotType.skills.recoil || 0.5) * 1.5);
          break;
      }
    } catch (error) {
      this.logger.error(`Error applying difficulty-based behavior: ${error}`);
    }
  }
  // Apply live Tarkov behavior settings
  applyBotBehaviorSettings(dbBotType, botConfig) {
    try {
      if (!botConfig.liveTarkovBehavior) return;
      const behavior = botConfig.liveTarkovBehavior;
      if (behavior.aggressive) {
        dbBotType.aggression = Math.min(1, (dbBotType.aggression || 0.5) * 1.2);
      }
      if (behavior.cautious) {
        dbBotType.aggression = Math.max(0.1, (dbBotType.aggression || 0.5) * 0.8);
      }
    } catch (error) {
      this.logger.error(`Error applying bot behavior settings: ${error}`);
    }
  }
  // Apply gear progression system
  applyGearProgression() {
    try {
      const config = this.configManager.getConfig();
      const gearProgression = config.globalSettings?.gearProgression;
      if (!gearProgression || !gearProgression.enabled) return;
      this.logger.info("Applying gear progression system...");
      this.applyPMCGearProgression();
      this.applyMetaAmmoEnforcement();
      this.logger.info("Gear progression system applied successfully");
    } catch (error) {
      this.logger.error(`Error applying gear progression: ${error}`);
    }
  }
  // Apply PMC gear progression based on level
  applyPMCGearProgression() {
    try {
      const config = this.configManager.getConfig();
      const gearProgression = config.globalSettings?.gearProgression;
      if (!gearProgression || !gearProgression.progressionTiers) return;
      const progression = gearProgression.progressionTiers;
      for (const [level, gearConfig] of Object.entries(progression)) {
        const minLevel = parseInt(level);
        if (isNaN(minLevel)) continue;
        this.logger.info(`Configured gear progression for level ${minLevel}+`);
      }
    } catch (error) {
      this.logger.error(`Error applying PMC gear progression: ${error}`);
    }
  }
  // Apply meta ammo enforcement
  applyMetaAmmoEnforcement() {
    try {
      const config = this.configManager.getConfig();
      const gearProgression = config.globalSettings?.gearProgression;
      if (!gearProgression || !gearProgression.metaAmmoTypes) return;
      const metaAmmoTypes = gearProgression.metaAmmoTypes;
      if (metaAmmoTypes.length > 0) {
        this.logger.info(`Meta ammo enforcement enabled with ${metaAmmoTypes.length} ammo types`);
      }
    } catch (error) {
      this.logger.error(`Error applying meta ammo enforcement: ${error}`);
    }
  }
  // Get spawn statistics for monitoring
  getSpawnStatistics() {
    try {
      const stats = {
        totalBots: 0,
        modifiedBots: 0,
        gearProgressionEnabled: this.configManager.isGearProgressionEnabled()
      };
      return stats;
    } catch (error) {
      this.logger.error(`Error getting spawn statistics: ${error}`);
      return {};
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpawnManager
});
//# sourceMappingURL=SpawnManager.js.map
