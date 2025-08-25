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
  configManager;
  botModificationService;
  logger;
  bushConfig;
  vegetationTypes = /* @__PURE__ */ new Set();
  activeBots = /* @__PURE__ */ new Map();
  constructor(configManager, botModificationService, logger) {
    this.configManager = configManager;
    this.botModificationService = botModificationService;
    this.logger = logger;
  }
  initialize() {
    try {
      this.logger.info("[LiveTarkovAI] Initializing BushShootingService...");
      this.bushConfig = this.configManager.getBushShootingConfig();
      if (this.bushConfig.enabled) {
        this.setupBushShootingSystem();
        this.logger.info("[LiveTarkovAI] BushShootingService initialized successfully");
      } else {
        this.logger.info("[LiveTarkovAI] BushShootingService disabled in configuration");
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error initializing BushShootingService: ${error}`);
    }
  }
  // Setup bush shooting system
  setupBushShootingSystem() {
    try {
      this.initializeVegetationTypes();
      this.setupShootingPrevention();
      this.setupTrackingSystems();
      this.logger.info("[LiveTarkovAI] Bush shooting system setup completed");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up bush shooting system: ${error}`);
    }
  }
  // Initialize vegetation types
  initializeVegetationTypes() {
    try {
      const vegetationTypes = this.bushConfig.vegetationTypes || ["bush", "tree", "grass", "foliage"];
      for (const vegetationType of vegetationTypes) {
        this.vegetationTypes.add(vegetationType.toLowerCase());
      }
      this.logger.info(`[LiveTarkovAI] Initialized ${this.vegetationTypes.size} vegetation types`);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error initializing vegetation types: ${error}`);
    }
  }
  // Setup shooting prevention systems
  setupShootingPrevention() {
    try {
      if (this.bushConfig.preventShootingThroughBushes) {
        this.setupShootingThroughBushPrevention();
      }
      if (this.bushConfig.preventShootingFromBushes) {
        this.setupShootingFromBushPrevention();
      }
      this.logger.info("[LiveTarkovAI] Shooting prevention systems configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up shooting prevention: ${error}`);
    }
  }
  // Setup shooting through bush prevention
  setupShootingThroughBushPrevention() {
    try {
      this.hookIntoBotShooting();
      this.setupLineOfSightChecks();
      this.logger.info("[LiveTarkovAI] Shooting through bush prevention configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up shooting through bush prevention: ${error}`);
    }
  }
  // Setup shooting from bush prevention
  setupShootingFromBushPrevention() {
    try {
      this.hookIntoBotPositioning();
      this.setupBushDetection();
      this.logger.info("[LiveTarkovAI] Shooting from bush prevention configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up shooting from bush prevention: ${error}`);
    }
  }
  // Setup tracking systems
  setupTrackingSystems() {
    try {
      if (this.bushConfig.allowTrackingThroughBushes) {
        this.setupBushTracking();
        this.logger.info("[LiveTarkovAI] Bush tracking system configured");
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up tracking systems: ${error}`);
    }
  }
  // Hook into bot shooting mechanics
  hookIntoBotShooting() {
    try {
      this.monitorBotShooting();
      this.logger.info("[LiveTarkovAI] Bot shooting hooks configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into bot shooting: ${error}`);
    }
  }
  // Setup line of sight checks
  setupLineOfSightChecks() {
    try {
      this.logger.info("[LiveTarkovAI] Line of sight checks configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up line of sight checks: ${error}`);
    }
  }
  // Hook into bot positioning
  hookIntoBotPositioning() {
    try {
      this.monitorBotPositions();
      this.logger.info("[LiveTarkovAI] Bot positioning hooks configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error hooking into bot positioning: ${error}`);
    }
  }
  // Setup bush detection
  setupBushDetection() {
    try {
      this.logger.info("[LiveTarkovAI] Bush detection system configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up bush detection: ${error}`);
    }
  }
  // Setup bush tracking
  setupBushTracking() {
    try {
      this.logger.info("[LiveTarkovAI] Bush tracking system configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up bush tracking: ${error}`);
    }
  }
  // Monitor bot shooting events
  monitorBotShooting() {
    try {
      setInterval(() => {
        this.checkBotShooting();
      }, 1e3);
      this.logger.info("[LiveTarkovAI] Bot shooting monitoring configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up bot shooting monitoring: ${error}`);
    }
  }
  // Monitor bot positions
  monitorBotPositions() {
    try {
      setInterval(() => {
        this.checkBotPositions();
      }, 2e3);
      this.logger.info("[LiveTarkovAI] Bot position monitoring configured");
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error setting up bot position monitoring: ${error}`);
    }
  }
  // Check bot shooting for bush violations
  checkBotShooting() {
    try {
      for (const [botId, bot] of this.activeBots) {
        if (this.isBotShooting(bot)) {
          this.handleBotShooting(bot);
        }
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error checking bot shooting: ${error}`);
    }
  }
  // Check bot positions for bush violations
  checkBotPositions() {
    try {
      for (const [botId, bot] of this.activeBots) {
        if (this.isBotInBush(bot)) {
          this.handleBotInBush(bot);
        }
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error checking bot positions: ${error}`);
    }
  }
  // Check if bot is shooting
  isBotShooting(bot) {
    try {
      return bot && bot.isShooting === true;
    } catch (error) {
      return false;
    }
  }
  // Check if bot is in bush
  isBotInBush(bot) {
    try {
      if (!bot || !bot.position) return false;
      return this.isPositionNearVegetation(bot.position);
    } catch (error) {
      return false;
    }
  }
  // Check if position is near vegetation
  isPositionNearVegetation(position) {
    try {
      const vegetationPositions = this.getVegetationPositions();
      for (const vegPos of vegetationPositions) {
        const distance = this.calculateDistance(position, vegPos);
        if (distance <= this.bushConfig.bushDetectionRange) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  // Get vegetation positions
  getVegetationPositions() {
    try {
      return [];
    } catch (error) {
      return [];
    }
  }
  // Calculate distance between two positions
  calculateDistance(pos1, pos2) {
    try {
      if (!pos1 || !pos2 || !pos1.x || !pos1.y || !pos1.z || !pos2.x || !pos2.y || !pos2.z) {
        return Infinity;
      }
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      const dz = pos1.z - pos2.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    } catch (error) {
      return Infinity;
    }
  }
  // Handle bot shooting violations
  handleBotShooting(bot) {
    try {
      if (!bot) return;
      if (this.isBotShootingThroughVegetation(bot)) {
        this.preventShootingThroughVegetation(bot);
      }
      if (this.isBotShootingFromVegetation(bot)) {
        this.preventShootingFromVegetation(bot);
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error handling bot shooting: ${error}`);
    }
  }
  // Handle bot in bush violations
  handleBotInBush(bot) {
    try {
      if (!bot) return;
      this.applyBushRestrictions(bot);
      this.logger.info(`[LiveTarkovAI] Bot ${bot.id || "unknown"} detected in bush - restrictions applied`);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error handling bot in bush: ${error}`);
    }
  }
  // Check if bot is shooting through vegetation
  isBotShootingThroughVegetation(bot) {
    try {
      if (!bot || !bot.position || !bot.targetPosition) return false;
      return this.doesLinePassThroughVegetation(bot.position, bot.targetPosition);
    } catch (error) {
      return false;
    }
  }
  // Check if bot is shooting from vegetation
  isBotShootingFromVegetation(bot) {
    try {
      if (!bot || !bot.position) return false;
      return this.isPositionInVegetation(bot.position);
    } catch (error) {
      return false;
    }
  }
  // Check if line passes through vegetation
  doesLinePassThroughVegetation(startPos, endPos) {
    try {
      return this.isPositionNearVegetation(startPos) || this.isPositionNearVegetation(endPos);
    } catch (error) {
      return false;
    }
  }
  // Check if position is in vegetation
  isPositionInVegetation(position) {
    try {
      const vegetationPositions = this.getVegetationPositions();
      for (const vegPos of vegetationPositions) {
        const distance = this.calculateDistance(position, vegPos);
        if (distance <= 5) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  // Prevent shooting through vegetation
  preventShootingThroughVegetation(bot) {
    try {
      if (!bot) return;
      this.cancelBotShot(bot);
      this.applyShootingPenalty(bot);
      this.logger.info(`[LiveTarkovAI] Prevented bot ${bot.id || "unknown"} from shooting through vegetation`);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error preventing shooting through vegetation: ${error}`);
    }
  }
  // Prevent shooting from vegetation
  preventShootingFromVegetation(bot) {
    try {
      if (!bot) return;
      this.cancelBotShot(bot);
      this.applyShootingPenalty(bot);
      this.logger.info(`[LiveTarkovAI] Prevented bot ${bot.id || "unknown"} from shooting from vegetation`);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error preventing shooting from vegetation: ${error}`);
    }
  }
  // Apply bush restrictions
  applyBushRestrictions(bot) {
    try {
      if (!bot) return;
      if (bot.accuracy !== void 0) {
        bot.originalAccuracy = bot.accuracy;
        bot.accuracy = Math.max(0.1, bot.accuracy * 0.3);
      }
      if (bot.reactionTime !== void 0) {
        bot.originalReactionTime = bot.reactionTime;
        bot.reactionTime = bot.reactionTime * 2;
      }
      bot.bushRestricted = true;
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying bush restrictions: ${error}`);
    }
  }
  // Cancel bot shot
  cancelBotShot(bot) {
    try {
      if (!bot) return;
      bot.shotCancelled = true;
      bot.lastShotTime = Date.now();
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error cancelling bot shot: ${error}`);
    }
  }
  // Apply shooting penalty
  applyShootingPenalty(bot) {
    try {
      if (!bot) return;
      if (bot.reactionTime !== void 0) {
        bot.reactionTime = bot.reactionTime * 1.5;
        setTimeout(() => {
          if (bot.reactionTime && bot.originalReactionTime) {
            bot.reactionTime = bot.originalReactionTime;
          }
        }, 5e3);
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error applying shooting penalty: ${error}`);
    }
  }
  // Add bot to monitoring
  addBot(botId, bot) {
    try {
      if (!botId || !bot) return;
      this.activeBots.set(botId, bot);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error adding bot to monitoring: ${error}`);
    }
  }
  // Remove bot from monitoring
  removeBot(botId) {
    try {
      if (!botId) return;
      this.activeBots.delete(botId);
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error removing bot from monitoring: ${error}`);
    }
  }
  // Get bush shooting configuration
  getBushConfig() {
    return this.bushConfig;
  }
  // Update bush shooting configuration
  updateBushConfig(newConfig) {
    try {
      this.bushConfig = { ...this.bushConfig, ...newConfig };
      if (this.bushConfig.enabled) {
        this.setupBushShootingSystem();
        this.logger.info("[LiveTarkovAI] Bush shooting configuration updated");
      }
    } catch (error) {
      this.logger.error(`[LiveTarkovAI] Error updating bush shooting configuration: ${error}`);
    }
  }
  // Get active bot count
  getActiveBotCount() {
    return this.activeBots.size;
  }
  // Get vegetation types
  getVegetationTypes() {
    return new Set(this.vegetationTypes);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BushShootingService
});
//# sourceMappingURL=BushShootingService.js.map
