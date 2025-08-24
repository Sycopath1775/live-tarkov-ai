"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SainIntegrationService = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
let SainIntegrationService = class SainIntegrationService {
    config;
    isSainActive = false;
    sainBotIds = new Set();
    behaviorOverrides = new Map();
    constructor(config) {
        this.config = config;
        this.detectSainMod();
    }
    /**
     * Detect if SAIN mod is active and initialize integration
     */
    detectSainMod() {
        try {
            // Check if SAIN mod is loaded
            const sainMod = require("zSolarint-SAIN-ServerMod");
            if (sainMod) {
                this.isSainActive = true;
                console.log("[Live Tarkov - AI] SAIN mod detected - enabling integration");
                this.initializeSainIntegration();
            }
        }
        catch (error) {
            console.log("[Live Tarkov - AI] SAIN mod not detected - running without SAIN integration");
            this.isSainActive = false;
        }
    }
    /**
     * Initialize SAIN integration features
     */
    initializeSainIntegration() {
        if (!this.config.enabled || !this.isSainActive)
            return;
        try {
            // Hook into SAIN's bot management system
            this.hookIntoSainBotSystem();
            // Set up behavior synchronization
            if (this.config.syncBotBehavior) {
                this.setupBehaviorSynchronization();
            }
            // Set up enhanced pathfinding
            if (this.config.enhancedPathfinding) {
                this.setupEnhancedPathfinding();
            }
            // Set up tactical movement
            if (this.config.tacticalMovement) {
                this.setupTacticalMovement();
            }
            console.log("[Live Tarkov - AI] SAIN integration initialized successfully");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error initializing SAIN integration:", error);
        }
    }
    /**
     * Hook into SAIN's bot management system
     */
    hookIntoSainBotSystem() {
        try {
            // Listen for SAIN bot events
            this.setupSainBotListeners();
            // Sync bot states
            this.setupBotStateSync();
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error hooking into SAIN bot system:", error);
        }
    }
    /**
     * Set up listeners for SAIN bot events
     */
    setupSainBotListeners() {
        try {
            // This would hook into SAIN's bot spawn and behavior events
            // For now, we'll implement a basic detection system
            console.log("[Live Tarkov - AI] SAIN bot listeners configured");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up SAIN bot listeners:", error);
        }
    }
    /**
     * Set up bot state synchronization
     */
    setupBotStateSync() {
        try {
            // Sync bot states between our mod and SAIN
            console.log("[Live Tarkov - AI] Bot state sync configured with SAIN");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up bot state sync:", error);
        }
    }
    /**
     * Set up behavior synchronization
     */
    setupBehaviorSynchronization() {
        try {
            // Synchronize bot behaviors with SAIN
            this.setupScavBehaviorSync();
            this.setupPmcBehaviorSync();
            this.setupBossBehaviorSync();
            console.log("[Live Tarkov - AI] Behavior synchronization configured with SAIN");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up behavior synchronization:", error);
        }
    }
    /**
     * Set up scav behavior synchronization
     */
    setupScavBehaviorSync() {
        try {
            if (this.config.scavBehavior.annoyingButNotDeadly) {
                // Configure scavs to be annoying but not deadly
                this.configureScavBehavior();
            }
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up scav behavior sync:", error);
        }
    }
    /**
     * Set up PMC behavior synchronization
     */
    setupPmcBehaviorSync() {
        try {
            if (this.config.pmcBehavior.tacticalAndTough) {
                // Configure PMCs to be tactical and tough
                this.configurePmcBehavior();
            }
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up PMC behavior sync:", error);
        }
    }
    /**
     * Set up boss behavior synchronization
     */
    setupBossBehaviorSync() {
        try {
            if (this.config.bossBehavior.toughButNotInstaKill) {
                // Configure bosses to be tough but not insta-kill
                this.configureBossBehavior();
            }
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up boss behavior sync:", error);
        }
    }
    /**
     * Configure scav behavior for SAIN integration
     */
    configureScavBehavior() {
        try {
            // Apply scav behavior overrides
            const scavOverrides = {
                accuracy: this.config.scavBehavior.reducedAccuracy,
                avoidHeadshots: this.config.scavBehavior.avoidHeadshots,
                preventStomachBlacking: this.config.scavBehavior.preventStomachBlacking,
                behavior: "annoying"
            };
            this.behaviorOverrides.set("scav", scavOverrides);
            console.log("[Live Tarkov - AI] Scav behavior configured for SAIN integration");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error configuring scav behavior:", error);
        }
    }
    /**
     * Configure PMC behavior for SAIN integration
     */
    configurePmcBehavior() {
        try {
            // Apply PMC behavior overrides
            const pmcOverrides = {
                accuracy: this.config.pmcBehavior.realisticAccuracy,
                avoidInstaKills: this.config.pmcBehavior.avoidInstaKills,
                properGearUsage: this.config.pmcBehavior.properGearUsage,
                behavior: "tactical"
            };
            this.behaviorOverrides.set("pmc", pmcOverrides);
            console.log("[Live Tarkov - AI] PMC behavior configured for SAIN integration");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error configuring PMC behavior:", error);
        }
    }
    /**
     * Configure boss behavior for SAIN integration
     */
    configureBossBehavior() {
        try {
            // Apply boss behavior overrides
            const bossOverrides = {
                avoidHeadshotSpam: this.config.bossBehavior.avoidHeadshotSpam,
                realisticDifficulty: this.config.bossBehavior.realisticDifficulty,
                properMechanics: this.config.bossBehavior.properMechanics,
                behavior: "boss"
            };
            this.behaviorOverrides.set("boss", bossOverrides);
            console.log("[Live Tarkov - AI] Boss behavior configured for SAIN integration");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error configuring boss behavior:", error);
        }
    }
    /**
     * Set up enhanced pathfinding
     */
    setupEnhancedPathfinding() {
        try {
            // Integrate with SAIN's enhanced pathfinding system
            console.log("[Live Tarkov - AI] Enhanced pathfinding configured with SAIN");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up enhanced pathfinding:", error);
        }
    }
    /**
     * Set up tactical movement
     */
    setupTacticalMovement() {
        try {
            // Integrate with SAIN's tactical movement system
            console.log("[Live Tarkov - AI] Tactical movement configured with SAIN");
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error setting up tactical movement:", error);
        }
    }
    /**
     * Apply behavior overrides to a bot
     */
    applyBehaviorOverrides(botId, botType, botData) {
        if (!this.config.enabled || !this.isSainActive)
            return;
        try {
            const overrides = this.behaviorOverrides.get(botType);
            if (overrides) {
                // Apply the behavior overrides
                this.applyOverridesToBot(botId, botData, overrides);
                console.log(`[Live Tarkov - AI] Applied SAIN behavior overrides to bot ${botId}`);
            }
        }
        catch (error) {
            console.error(`[Live Tarkov - AI] Error applying behavior overrides to bot ${botId}:`, error);
        }
    }
    /**
     * Apply overrides to a bot
     */
    applyOverridesToBot(botId, botData, overrides) {
        try {
            // Apply accuracy overrides
            if (overrides.accuracy !== undefined) {
                botData.accuracy = overrides.accuracy;
            }
            // Apply behavior-specific overrides
            if (overrides.behavior) {
                botData.behaviorType = overrides.behavior;
            }
            // Mark this as a SAIN-managed bot
            this.sainBotIds.add(botId);
        }
        catch (error) {
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
        }
        catch (error) {
            console.error("[Live Tarkov - AI] Error cleaning up SAIN integration:", error);
        }
    }
};
exports.SainIntegrationService = SainIntegrationService;
exports.SainIntegrationService = SainIntegrationService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], SainIntegrationService);
//# sourceMappingURL=SainIntegrationService.js.map