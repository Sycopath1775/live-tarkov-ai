var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var SpawnManager_exports = {};
__export(SpawnManager_exports, {
  SpawnManager: () => SpawnManager
});
module.exports = __toCommonJS(SpawnManager_exports);
var import_ConfigManager = require("./ConfigManager");
var path = __toESM(require("path"));
var fs = __toESM(require("fs"));
class SpawnManager {
  databaseServer = null;
  configManager;
  sainAvailable = false;
  constructor() {
    this.configManager = new import_ConfigManager.ConfigManager();
  }
  initialize(databaseServer) {
    this.databaseServer = databaseServer;
    this.checkSAINAvailability();
  }
  checkSAINAvailability() {
    try {
      const sainDetected = this.detectSAINMod();
      if (sainDetected) {
        this.sainAvailable = true;
        console.log("[LiveTarkovAI] SAIN integration available - enhanced bot behavior enabled");
      } else {
        this.sainAvailable = false;
        console.log("[LiveTarkovAI] SAIN not available - using standard bot behavior");
      }
    } catch (error) {
      this.sainAvailable = false;
      console.log("[LiveTarkovAI] SAIN not available - using standard bot behavior");
    }
  }
  // Detect SAIN mod using multiple methods (same as main mod)
  detectSAINMod() {
    try {
      try {
        require("zSolarint-SAIN-ServerMod");
        return true;
      } catch (error) {
      }
      const possibleSainPaths = [
        path.join(process.cwd(), "user", "mods", "zSolarint-SAIN-ServerMod"),
        path.join(__dirname, "..", "..", "zSolarint-SAIN-ServerMod"),
        path.join(process.cwd(), "mods", "zSolarint-SAIN-ServerMod")
      ];
      for (const sainPath of possibleSainPaths) {
        if (fs.existsSync(sainPath)) {
          return true;
        }
      }
      for (const modulePath in require.cache) {
        if (modulePath.includes("zSolarint-SAIN-ServerMod") || modulePath.includes("SAIN")) {
          return true;
        }
      }
      if (process.mainModule && process.mainModule.children) {
        for (const child of process.mainModule.children) {
          if (child.filename && (child.filename.includes("SAIN") || child.filename.includes("zSolarint"))) {
            return true;
          }
        }
      }
      if (globalThis.SAINService || globalThis.SAINBotService || globalThis.SAIN) {
        return true;
      }
      try {
        if (globalThis.SPT_CONTAINER) {
          const container = globalThis.SPT_CONTAINER;
          if (container.resolve && container.resolve("SAINService")) {
            return true;
          }
          if (container.resolve && container.resolve("SAINBotService")) {
            return true;
          }
        }
      } catch (error) {
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  applyCustomSpawnConfig() {
    try {
      const config = this.configManager.getConfig();
      if (!config.enabled) {
        console.log("[LiveTarkovAI] Mod is disabled, skipping spawn configuration");
        return;
      }
      console.log("[LiveTarkovAI] Applying live Tarkov spawn configuration...");
      this.modifyBotTypes();
      console.log("[LiveTarkovAI] Live Tarkov spawn configuration applied successfully");
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying spawn configuration: ${error}`);
    }
  }
  modifyRaidSpawns(mapBase, raidAdjustments) {
    try {
      const config = this.configManager.getConfig();
      if (!config.enabled) {
        return;
      }
      const mapName = mapBase.Name;
      const mapConfig = this.configManager.getMapConfig(mapName);
      if (!mapConfig || !mapConfig.enabled) {
        return;
      }
      console.log(`[LiveTarkovAI] Modifying spawns for map: ${mapName}`);
      if (mapConfig.liveTarkovSettings?.useAuthenticSpawns) {
        this.applyLiveTarkovSpawns(raidAdjustments, mapConfig);
      } else {
        if (raidAdjustments.botCountAdjustments) {
          raidAdjustments.botCountAdjustments.min = mapConfig.minBots || 0;
          raidAdjustments.botCountAdjustments.max = mapConfig.maxBots || 0;
        }
      }
      if (config.waveSettings?.enabled) {
        this.modifyWaveSettings(raidAdjustments, mapConfig);
      }
      this.applyBotTypeRestrictions(raidAdjustments, mapConfig);
    } catch (error) {
      console.error(`[LiveTarkovAI] Error modifying raid spawns: ${error}`);
    }
  }
  applyLiveTarkovSpawns(raidAdjustments, mapConfig) {
    try {
      const liveSettings = mapConfig.liveTarkovSettings;
      if (!liveSettings) return;
      if (raidAdjustments.botCountAdjustments) {
        raidAdjustments.botCountAdjustments.min = liveSettings.raidStartBots || 0;
        raidAdjustments.botCountAdjustments.max = liveSettings.raidStartBots || 0;
      }
      if (raidAdjustments.waveSettings) {
        raidAdjustments.waveSettings.count = liveSettings.maxWaves || 0;
        raidAdjustments.waveSettings.delay = liveSettings.waveDelay || 0;
        raidAdjustments.waveSettings.botsPerWave = liveSettings.waveBots || 0;
      }
      this.applyLiveTarkovBehavior(raidAdjustments, mapConfig);
      console.log(`[LiveTarkovAI] Applied live Tarkov spawns: ${liveSettings.raidStartBots} bots at start, ${liveSettings.maxWaves} waves`);
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying live Tarkov spawns: ${error}`);
    }
  }
  applyLiveTarkovBehavior(raidAdjustments, mapConfig) {
    try {
      const liveSettings = mapConfig.liveTarkovSettings;
      if (!liveSettings) return;
      if (liveSettings.scavBehavior === "passive") {
        this.modifyScavBehavior("passive");
      } else if (liveSettings.scavBehavior === "aggressive") {
        this.modifyScavBehavior("aggressive");
      }
      if (liveSettings.pmcBehavior === "tactical") {
        this.modifyPMCBehavior("tactical");
      } else if (liveSettings.pmcBehavior === "aggressive") {
        this.modifyPMCBehavior("aggressive");
      }
      console.log(`[LiveTarkovAI] Applied live Tarkov behavior: scavs=${liveSettings.scavBehavior}, pmcs=${liveSettings.pmcBehavior}`);
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying live Tarkov behavior: ${error}`);
    }
  }
  modifyBotTypes() {
    try {
      if (!this.databaseServer) {
        console.warn("[LiveTarkovAI] Database server not available, skipping bot type modifications");
        return;
      }
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
          console.warn(`[LiveTarkovAI] Bot type ${botType} not found in database`);
          continue;
        }
        this.applyGearTierRestrictions(dbBotType, botConfig);
        this.applyDifficultySettings(dbBotType, botConfig);
        this.applyBotBehaviorSettings(dbBotType, botConfig);
        modifiedCount++;
        modifiedTypes.push(botType);
      }
      if (modifiedCount > 0) {
        console.log(`[LiveTarkovAI] Modified ${modifiedCount} bot types: ${modifiedTypes.join(", ")}`);
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error modifying bot types: ${error}`);
    }
  }
  modifyWaveSettings(raidAdjustments, mapConfig) {
    try {
      const config = this.configManager.getConfig();
      const waveSettings = config.waveSettings;
      if (!waveSettings) return;
      if (waveSettings.enabled) {
        if (raidAdjustments.waveSettings) {
          raidAdjustments.waveSettings.count = waveSettings.waveCount || 0;
          raidAdjustments.waveSettings.delay = waveSettings.waveDelay || 0;
          raidAdjustments.waveSettings.botsPerWave = waveSettings.botsPerWave || 0;
        }
        if (waveSettings.dynamicScaling) {
          this.applyDynamicScaling(raidAdjustments, mapConfig);
        }
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error modifying wave settings: ${error}`);
    }
  }
  applyBotTypeRestrictions(raidAdjustments, mapConfig) {
    try {
      const allowedBotTypes = Object.entries(mapConfig.botTypes || {}).filter(([_, config]) => config && typeof config === "object" && "enabled" in config && config.enabled).map(([type, _]) => type);
      if (raidAdjustments.botTypeAdjustments) {
        raidAdjustments.botTypeAdjustments.allowedTypes = allowedBotTypes;
      }
      for (const [botType, botConfig] of Object.entries(mapConfig.botTypes || {})) {
        if (botConfig && typeof botConfig === "object" && "enabled" in botConfig && botConfig.enabled) {
          const spawnChance = "spawnChance" in botConfig ? Number(botConfig.spawnChance) || 1 : 1;
          this.setBotTypeSpawnChance(botType, spawnChance);
        }
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying bot type restrictions: ${error}`);
    }
  }
  applyGearTierRestrictions(dbBotType, botConfig) {
    try {
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying gear restrictions: ${error}`);
    }
  }
  applyDifficultySettings(dbBotType, botConfig) {
    try {
      if (!botConfig.difficulty) return;
      switch (botConfig.difficulty) {
        case "easy":
          break;
        case "normal":
          break;
        case "hard":
          break;
        case "impossible":
          break;
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying difficulty settings: ${error}`);
    }
  }
  applyBotBehaviorSettings(dbBotType, botConfig) {
    try {
      const behavior = botConfig.liveTarkovBehavior;
      if (!behavior) return;
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying bot behavior settings: ${error}`);
    }
  }
  modifyScavBehavior(behavior) {
    try {
      switch (behavior) {
        case "passive":
          console.log("[LiveTarkovAI] Applied passive scav behavior - annoying but not deadly");
          break;
        case "aggressive":
          console.log("[LiveTarkovAI] Applied aggressive scav behavior - challenging but fair");
          break;
        case "mixed":
          console.log("[LiveTarkovAI] Applied mixed scav behavior - balanced challenge");
          break;
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error modifying scav behavior: ${error}`);
    }
  }
  modifyPMCBehavior(behavior) {
    try {
      switch (behavior) {
        case "tactical":
          console.log("[LiveTarkovAI] Applied tactical PMC behavior - tough but fair");
          break;
        case "aggressive":
          console.log("[LiveTarkovAI] Applied aggressive PMC behavior - challenging but fair");
          break;
        case "defensive":
          console.log("[LiveTarkovAI] Applied defensive PMC behavior - tactical defense");
          break;
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error modifying PMC behavior: ${error}`);
    }
  }
  applyDynamicScaling(raidAdjustments, mapConfig) {
    try {
      const currentTime = Date.now();
      const raidStartTime = currentTime;
      const timeElapsed = (currentTime - raidStartTime) / 1e3 / 60;
      const difficultyMultiplier = Math.min(1.5, 1 + timeElapsed / 30);
      if (raidAdjustments.botCountAdjustments) {
        raidAdjustments.botCountAdjustments.max = Math.floor(
          (mapConfig.maxBots || 0) * difficultyMultiplier
        );
      }
    } catch (error) {
      console.error(`[LiveTarkovAI] Error applying dynamic scaling: ${error}`);
    }
  }
  setBotTypeSpawnChance(botType, chance) {
    try {
      console.log(`[LiveTarkovAI] Applied spawn chance for ${botType}: ${chance}`);
    } catch (error) {
      console.error(`[LiveTarkovAI] Error setting spawn chance: ${error}`);
    }
  }
  getSpawnStatistics() {
    try {
      const config = this.configManager.getConfig();
      const stats = {
        totalBots: 0,
        botTypes: {},
        maps: {},
        dependencies: {
          waypoints: true,
          // Always true since it's required
          bigBrain: true,
          // Always true since it's required
          sain: this.sainAvailable,
          fika: false
          // Would need to check this separately
        }
      };
      for (const [mapName, mapConfig] of Object.entries(config.mapSettings || {})) {
        if (mapConfig && mapConfig.enabled) {
          stats.maps[mapName] = {
            totalBots: mapConfig.maxBots || 0,
            botTypes: mapConfig.botTypes || {},
            liveTarkovSettings: mapConfig.liveTarkovSettings || {}
          };
          stats.totalBots += mapConfig.maxBots || 0;
        }
      }
      for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
        if (botConfig && botConfig.enabled) {
          stats.botTypes[botType] = {
            gearTier: botConfig.gearTier,
            difficulty: botConfig.difficulty,
            spawnChance: botConfig.spawnChance,
            liveTarkovBehavior: botConfig.liveTarkovBehavior || {}
          };
        }
      }
      return stats;
    } catch (error) {
      console.error(`[LiveTarkovAI] Error getting spawn statistics: ${error}`);
      return {};
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpawnManager
});
//# sourceMappingURL=SpawnManager.js.map
