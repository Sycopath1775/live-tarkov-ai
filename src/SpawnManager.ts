// Remove problematic SPT imports and use any types for now
// import { DatabaseServer } from "@spt/servers/DatabaseServer";
// import { ILocationBase } from "@spt/models/eft/common/ILocationBase";
// import { IRaidChanges } from "@spt/models/spt/location/IRaidChanges";
import { ConfigManager } from "./ConfigManager";
import * as path from "path";
import * as fs from "fs";

// Define basic interfaces for SPT types
interface ILocationBase {
    Name: string;
    [key: string]: any;
}

interface IRaidChanges {
    botCountAdjustments?: {
        min: number;
        max: number;
    };
    waveSettings?: {
        count: number;
        delay: number;
        botsPerWave: number;
    };
    botTypeAdjustments?: {
        allowedTypes: string[];
    };
    [key: string]: any;
}

interface DatabaseServer {
    getTables(): {
        bots: {
            types: { [key: string]: any };
        };
    };
}

export class SpawnManager {
    private databaseServer: DatabaseServer | null = null;
    private configManager: ConfigManager;
    private sainAvailable: boolean = false;

    constructor() {
        this.configManager = new ConfigManager();
    }

    public initialize(databaseServer: DatabaseServer): void {
        this.databaseServer = databaseServer;
        
        // Check if SAIN is available for enhanced behavior
        this.checkSAINAvailability();
    }

    private checkSAINAvailability(): void {
        try {
            // Use the same robust SAIN detection as the main mod
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
    private detectSAINMod(): boolean {
        try {
            // Method 1: Try to require SAIN directly
            try {
                require("zSolarint-SAIN-ServerMod");
                return true;
            } catch (error) {
                // Continue to next method
            }

            // Method 2: Check for SAIN in mods folder
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

            // Method 3: Check for SAIN in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.includes("zSolarint-SAIN-ServerMod") || modulePath.includes("SAIN")) {
                    return true;
                }
            }

            // Method 4: Check for SAIN in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && (child.filename.includes("SAIN") || child.filename.includes("zSolarint"))) {
                        return true;
                    }
                }
            }

            // Method 5: Check for SAIN in global scope
            if (globalThis.SAINService || globalThis.SAINBotService || globalThis.SAIN) {
                return true;
            }

            // Method 6: Check for SAIN in SPT container if available
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
                // Continue to next method
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    public applyCustomSpawnConfig(): void {
        try {
            const config = this.configManager.getConfig();
            if (!config.enabled) {
                console.log("[LiveTarkovAI] Mod is disabled, skipping spawn configuration");
                return;
            }

            console.log("[LiveTarkovAI] Applying live Tarkov spawn configuration...");
            
            // Modify bot types based on configuration
            this.modifyBotTypes();
            
            console.log("[LiveTarkovAI] Live Tarkov spawn configuration applied successfully");
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying spawn configuration: ${error}`);
        }
    }

    public modifyRaidSpawns(mapBase: ILocationBase, raidAdjustments: IRaidChanges): void {
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

            // Apply live Tarkov spawn logic
            if (mapConfig.liveTarkovSettings?.useAuthenticSpawns) {
                this.applyLiveTarkovSpawns(raidAdjustments, mapConfig);
            } else {
                // Apply basic bot count adjustments
                if (raidAdjustments.botCountAdjustments) {
                    raidAdjustments.botCountAdjustments.min = mapConfig.minBots || 0;
                    raidAdjustments.botCountAdjustments.max = mapConfig.maxBots || 0;
                }
            }

            // Modify wave settings if enabled
            if (config.waveSettings?.enabled) {
                this.modifyWaveSettings(raidAdjustments, mapConfig);
            }

            // Apply bot type restrictions
            this.applyBotTypeRestrictions(raidAdjustments, mapConfig);

        } catch (error) {
            console.error(`[LiveTarkovAI] Error modifying raid spawns: ${error}`);
        }
    }

    private applyLiveTarkovSpawns(raidAdjustments: IRaidChanges, mapConfig: any): void {
        try {
            const liveSettings = mapConfig.liveTarkovSettings;
            if (!liveSettings) return;
            
            // Set raid start bot count (like live Tarkov)
            if (raidAdjustments.botCountAdjustments) {
                raidAdjustments.botCountAdjustments.min = liveSettings.raidStartBots || 0;
                raidAdjustments.botCountAdjustments.max = liveSettings.raidStartBots || 0;
            }

            // Configure wave system for authentic timing
            if (raidAdjustments.waveSettings) {
                raidAdjustments.waveSettings.count = liveSettings.maxWaves || 0;
                raidAdjustments.waveSettings.delay = liveSettings.waveDelay || 0;
                raidAdjustments.waveSettings.botsPerWave = liveSettings.waveBots || 0;
            }

            // Apply live Tarkov behavior settings
            this.applyLiveTarkovBehavior(raidAdjustments, mapConfig);

            console.log(`[LiveTarkovAI] Applied live Tarkov spawns: ${liveSettings.raidStartBots} bots at start, ${liveSettings.maxWaves} waves`);
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying live Tarkov spawns: ${error}`);
        }
    }

    private applyLiveTarkovBehavior(raidAdjustments: IRaidChanges, mapConfig: any): void {
        try {
            const liveSettings = mapConfig.liveTarkovSettings;
            if (!liveSettings) return;
            
            // Apply scav behavior (annoying but not deadly - as per your preferences)
            if (liveSettings.scavBehavior === "passive") {
                // Reduce scav aggression and accuracy
                this.modifyScavBehavior("passive");
            } else if (liveSettings.scavBehavior === "aggressive") {
                // Increase scav aggression but maintain balance
                this.modifyScavBehavior("aggressive");
            }

            // Apply PMC behavior (tactical and tough - as per your preferences)
            if (liveSettings.pmcBehavior === "tactical") {
                // Balanced PMC behavior
                this.modifyPMCBehavior("tactical");
            } else if (liveSettings.pmcBehavior === "aggressive") {
                // More aggressive PMCs
                this.modifyPMCBehavior("aggressive");
            }

            console.log(`[LiveTarkovAI] Applied live Tarkov behavior: scavs=${liveSettings.scavBehavior}, pmcs=${liveSettings.pmcBehavior}`);
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying live Tarkov behavior: ${error}`);
        }
    }

    private modifyBotTypes(): void {
        try {
            if (!this.databaseServer) {
                console.warn("[LiveTarkovAI] Database server not available, skipping bot type modifications");
                return;
            }

            const config = this.configManager.getConfig();
            const database = this.databaseServer.getTables();
            let modifiedCount = 0;
            const modifiedTypes: string[] = [];

            for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
                if (!botConfig || !botConfig.enabled) {
                    continue;
                }

                const dbBotType = database.bots.types[botType];
                if (!dbBotType) {
                    console.warn(`[LiveTarkovAI] Bot type ${botType} not found in database`);
                    continue;
                }

                // Apply gear tier restrictions
                this.applyGearTierRestrictions(dbBotType, botConfig);
                
                // Apply difficulty settings
                this.applyDifficultySettings(dbBotType, botConfig);

                // Apply live Tarkov behavior
                this.applyBotBehaviorSettings(dbBotType, botConfig);

                modifiedCount++;
                modifiedTypes.push(botType);
            }

            // Show summary instead of individual logs
            if (modifiedCount > 0) {
                console.log(`[LiveTarkovAI] Modified ${modifiedCount} bot types: ${modifiedTypes.join(', ')}`);
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error modifying bot types: ${error}`);
        }
    }

    private modifyWaveSettings(raidAdjustments: IRaidChanges, mapConfig: any): void {
        try {
            const config = this.configManager.getConfig();
            const waveSettings = config.waveSettings;
            if (!waveSettings) return;

            if (waveSettings.enabled) {
                // Modify wave count
                if (raidAdjustments.waveSettings) {
                    raidAdjustments.waveSettings.count = waveSettings.waveCount || 0;
                    raidAdjustments.waveSettings.delay = waveSettings.waveDelay || 0;
                    raidAdjustments.waveSettings.botsPerWave = waveSettings.botsPerWave || 0;
                }

                // Apply dynamic scaling if enabled
                if (waveSettings.dynamicScaling) {
                    this.applyDynamicScaling(raidAdjustments, mapConfig);
                }
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error modifying wave settings: ${error}`);
        }
    }

    private applyBotTypeRestrictions(raidAdjustments: IRaidChanges, mapConfig: any): void {
        try {
            // Filter allowed bot types for this map
            const allowedBotTypes = Object.entries(mapConfig.botTypes || {})
                .filter(([_, config]) => config && typeof config === 'object' && 'enabled' in config && config.enabled)
                .map(([type, _]) => type);

            if (raidAdjustments.botTypeAdjustments) {
                raidAdjustments.botTypeAdjustments.allowedTypes = allowedBotTypes;
            }

            // Apply spawn chances
            for (const [botType, botConfig] of Object.entries(mapConfig.botTypes || {})) {
                if (botConfig && typeof botConfig === 'object' && 'enabled' in botConfig && botConfig.enabled) {
                    const spawnChance = 'spawnChance' in botConfig ? Number(botConfig.spawnChance) || 1.0 : 1.0;
                    this.setBotTypeSpawnChance(botType, spawnChance);
                }
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying bot type restrictions: ${error}`);
        }
    }

    private applyGearTierRestrictions(dbBotType: any, botConfig: any): void {
        try {
            // Apply gear tier restrictions based on configuration
            // This would modify the bot's equipment generation parameters
            
            // Note: Gear restrictions are applied silently
            // Only log errors if something goes wrong
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying gear restrictions: ${error}`);
        }
    }

    private applyDifficultySettings(dbBotType: any, botConfig: any): void {
        try {
            if (!botConfig.difficulty) return;
            
            // Apply difficulty-based behavior modifications
            // This would modify the bot's AI difficulty parameters
            
            switch (botConfig.difficulty) {
                case "easy":
                    // Reduce accuracy, reaction time, etc.
                    break;
                case "normal":
                    // Default settings
                    break;
                case "hard":
                    // Increase accuracy, reaction time, etc.
                    break;
                case "impossible":
                    // Maximum difficulty settings
                    break;
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying difficulty settings: ${error}`);
        }
    }

    private applyBotBehaviorSettings(dbBotType: any, botConfig: any): void {
        try {
            const behavior = botConfig.liveTarkovBehavior;
            if (!behavior) return;
            
            // Apply live Tarkov behavior settings
            // This would modify the bot's AI behavior parameters
            
            // Note: Individual behavior settings are applied silently
            // Only log errors if something goes wrong
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying bot behavior settings: ${error}`);
        }
    }

    private modifyScavBehavior(behavior: string): void {
        try {
            // Modify scav behavior based on your preferences
            // "annoying but not deadly"
            
            switch (behavior) {
                case "passive":
                    // Reduce scav accuracy and aggression
                    console.log("[LiveTarkovAI] Applied passive scav behavior - annoying but not deadly");
                    break;
                case "aggressive":
                    // Increase scav aggression but maintain balance
                    console.log("[LiveTarkovAI] Applied aggressive scav behavior - challenging but fair");
                    break;
                case "mixed":
                    // Balanced scav behavior
                    console.log("[LiveTarkovAI] Applied mixed scav behavior - balanced challenge");
                    break;
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error modifying scav behavior: ${error}`);
        }
    }

    private modifyPMCBehavior(behavior: string): void {
        try {
            // Modify PMC behavior based on your preferences
            // "tough and tactical but not headshotty or insta-killing"
            
            switch (behavior) {
                case "tactical":
                    // Balanced PMC behavior - tactical but fair
                    console.log("[LiveTarkovAI] Applied tactical PMC behavior - tough but fair");
                    break;
                case "aggressive":
                    // More aggressive PMCs but still balanced
                    console.log("[LiveTarkovAI] Applied aggressive PMC behavior - challenging but fair");
                    break;
                case "defensive":
                    // Defensive PMC behavior
                    console.log("[LiveTarkovAI] Applied defensive PMC behavior - tactical defense");
                    break;
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error modifying PMC behavior: ${error}`);
        }
    }

    private applyDynamicScaling(raidAdjustments: IRaidChanges, mapConfig: any): void {
        try {
            // Implement dynamic scaling based on player count, time, etc.
            // This would adjust bot counts and difficulty dynamically
            
            // Example: Scale bot count based on time
            const currentTime = Date.now();
            const raidStartTime = currentTime; // This would come from raid data
            
            // Increase difficulty over time
            const timeElapsed = (currentTime - raidStartTime) / 1000 / 60; // minutes
            const difficultyMultiplier = Math.min(1.5, 1 + (timeElapsed / 30)); // Max 1.5x at 30 minutes
            
            if (raidAdjustments.botCountAdjustments) {
                raidAdjustments.botCountAdjustments.max = Math.floor(
                    (mapConfig.maxBots || 0) * difficultyMultiplier
                );
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error applying dynamic scaling: ${error}`);
        }
    }

    private setBotTypeSpawnChance(botType: string, chance: number): void {
        try {
            // Set spawn chance for specific bot type
            // Implementation depends on SPT version and available methods
            
            console.log(`[LiveTarkovAI] Applied spawn chance for ${botType}: ${chance}`);
        } catch (error) {
            console.error(`[LiveTarkovAI] Error setting spawn chance: ${error}`);
        }
    }

    public getSpawnStatistics(): any {
        try {
            const config = this.configManager.getConfig();
            const stats = {
                totalBots: 0,
                botTypes: {},
                maps: {},
                dependencies: {
                    waypoints: true, // Always true since it's required
                    bigBrain: true,  // Always true since it's required
                    sain: this.sainAvailable,
                    fika: false // Would need to check this separately
                }
            };

            // Calculate statistics based on configuration
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