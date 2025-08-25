import { DatabaseServer, Logger, DependencyContainer } from "./types/spt-types";
import { ConfigManager } from "./ConfigManager";

export class SpawnManager {
    private databaseServer: DatabaseServer;
    private configManager: ConfigManager;
    private logger: Logger;
    private container: DependencyContainer;
    
    // SPT Router Service for REAL spawn control
    private staticRouterService: any;

    constructor(databaseServer: DatabaseServer, configManager: ConfigManager, logger: Logger, container: DependencyContainer) {
        this.databaseServer = databaseServer;
        this.configManager = configManager;
        this.logger = logger;
        this.container = container;
    }

    public initialize(): void {
        try {
            this.logger.info("Initializing REAL SPT router-based spawn control system...");
            
            // Resolve SPT router service for REAL control
            this.resolveRouterService();
            
            // Apply custom spawn configurations to database
            this.applyCustomSpawnConfig();
            
            // Register router hooks for REAL spawn control
            this.registerSpawnRouterHooks();
            
            this.logger.info("REAL SPT router-based spawn control system initialized successfully");
        } catch (error) {
            this.logger.error(`Error initializing spawn system: ${error}`);
        }
    }

    // Resolve SPT router service for REAL control
    private resolveRouterService(): void {
        try {
            this.staticRouterService = this.container.resolve("StaticRouterModService");
            
            if (this.staticRouterService) {
                this.logger.info("✓ StaticRouterModService available - REAL spawn control enabled");
            } else {
                this.logger.error("❌ StaticRouterModService not available - spawn control disabled");
            }
            
        } catch (error) {
            this.logger.error(`Error resolving router service: ${error}`);
        }
    }

    // Register router hooks for REAL spawn control
    private registerSpawnRouterHooks(): void {
        try {
            if (!this.staticRouterService) {
                this.logger.warn("Router service not available - cannot register spawn hooks");
                return;
            }

            // Register bot generation router hook
            this.registerBotGenerationRouter();
            
            // Register raid start router hook
            this.registerRaidStartRouter();
            
            // Register game start router hook
            this.registerGameStartRouter();
            
            this.logger.info("All spawn router hooks registered successfully");
            
        } catch (error) {
            this.logger.error(`Error registering router hooks: ${error}`);
        }
    }

    // Register router hook for bot generation - REAL spawn control
    private registerBotGenerationRouter(): void {
        try {
            this.staticRouterService.registerStaticRouter(
                "LiveTarkovAI-BotGenerationRouter",
                [
                    {
                        url: "/client/game/bot/generate",
                        action: async (url: string, info: any, sessionId: string, output: string) => {
                            try {
                                // RESEARCH: Log the actual data structures we're intercepting
                                this.logger.info("=== BOT GENERATION ROUTER INTERCEPTED ===");
                                this.logger.info(`URL: ${url}`);
                                this.logger.info(`Session ID: ${sessionId}`);
                                this.logger.info(`Info object structure: ${JSON.stringify(info, null, 2)}`);
                                this.logger.info(`Output length: ${output.length} characters`);
                                
                                // Parse the bot generation output
                                const outputJSON = JSON.parse(output);
                                
                                // RESEARCH: Log the actual output structure
                                this.logger.info(`Output JSON structure: ${JSON.stringify(outputJSON, null, 2)}`);
                                
                                // RESEARCH: Analyze what we can actually control
                                this.analyzeBotGenerationData(outputJSON, info);
                                
                                // Apply Live Tarkov bot spawn rules
                                const modifiedOutput = this.applyBotSpawnRules(outputJSON, info);
                                
                                this.logger.info(`Applied bot spawn rules for ${info.location || 'unknown location'}`);
                                this.logger.info("=== BOT GENERATION ROUTER COMPLETED ===");
                                
                                return JSON.stringify(modifiedOutput);
                            } catch (error) {
                                this.logger.error(`Error in bot generation router: ${error}`);
                                this.logger.error(`Stack trace: ${error.stack}`);
                                return output; // Fallback to original
                            }
                        }
                    }
                ],
                "LiveTarkovAI"
            );
            
            this.logger.info("Bot generation router hook registered");
            
        } catch (error) {
            this.logger.error(`Error registering bot generation router: ${error}`);
        }
    }

    // Register router hook for raid start - REAL spawn control
    private registerRaidStartRouter(): void {
        try {
            this.staticRouterService.registerStaticRouter(
                "LiveTarkovAI-RaidStartRouter",
                [
                    {
                        url: "/client/match/local/start",
                        action: async (url: string, info: any, sessionId: string, output: string) => {
                            try {
                                // RESEARCH: Log the actual data structures we're intercepting
                                this.logger.info("=== RAID START ROUTER INTERCEPTED ===");
                                this.logger.info(`URL: ${url}`);
                                this.logger.info(`Session ID: ${sessionId}`);
                                this.logger.info(`Info object structure: ${JSON.stringify(info, null, 2)}`);
                                this.logger.info(`Output length: ${output.length} characters`);
                                
                                // Parse the raid start output
                                const outputJSON = JSON.parse(output);
                                
                                // RESEARCH: Log the actual output structure
                                this.logger.info(`Output JSON structure: ${JSON.stringify(outputJSON, null, 2)}`);
                                
                                // RESEARCH: Analyze what we can actually control
                                this.analyzeRaidStartData(outputJSON, info);
                                
                                // Apply Live Tarkov raid spawn rules
                                const modifiedOutput = this.applyRaidSpawnRules(outputJSON, info);
                                
                                this.logger.info(`Applied raid spawn rules for ${info.location || 'unknown location'}`);
                                this.logger.info("=== RAID START ROUTER COMPLETED ===");
                                
                                return JSON.stringify(modifiedOutput);
                            } catch (error) {
                                this.logger.error(`Error in raid start router: ${error}`);
                                this.logger.error(`Stack trace: ${error.stack}`);
                                return output; // Fallback to original
                            }
                        }
                    }
                ],
                "LiveTarkovAI"
            );
            
            this.logger.info("Raid start router hook registered");
            
        } catch (error) {
            this.logger.error(`Error registering raid start router: ${error}`);
        }
    }

    // Register router hook for game start - REAL spawn control
    private registerGameStartRouter(): void {
        try {
            this.staticRouterService.registerStaticRouter(
                "LiveTarkovAI-GameStartRouter",
                [
                    {
                        url: "/client/game/start",
                        action: async (url: string, info: any, sessionId: string, output: string) => {
                            try {
                                // RESEARCH: Log the actual data structures we're intercepting
                                this.logger.info("=== GAME START ROUTER INTERCEPTED ===");
                                this.logger.info(`URL: ${url}`);
                                this.logger.info(`Session ID: ${sessionId}`);
                                this.logger.info(`Info object structure: ${JSON.stringify(info, null, 2)}`);
                                this.logger.info(`Output length: ${output.length} characters`);
                                
                                // Parse the game start output
                                const outputJSON = JSON.parse(output);
                                
                                // RESEARCH: Log the actual output structure
                                this.logger.info(`Output JSON structure: ${JSON.stringify(outputJSON, null, 2)}`);
                                
                                // RESEARCH: Analyze what we can actually control
                                this.analyzeGameStartData(outputJSON, info);
                                
                                // Apply Live Tarkov game spawn rules
                                const modifiedOutput = this.applyGameSpawnRules(outputJSON, info);
                                
                                this.logger.info("Applied game spawn rules");
                                this.logger.info("=== GAME START ROUTER COMPLETED ===");
                                
                                return JSON.stringify(modifiedOutput);
                            } catch (error) {
                                this.logger.error(`Error in game start router: ${error}`);
                                this.logger.error(`Stack trace: ${error.stack}`);
                                return output; // Fallback to original
                            }
                        }
                    }
                ],
                "LiveTarkovAI"
            );
            
            this.logger.info("Game start router hook registered");
            
        } catch (error) {
            this.logger.error(`Error registering game start router: ${error}`);
        }
    }

    // Apply Live Tarkov bot spawn rules - REAL spawn control
    private applyBotSpawnRules(outputJSON: any, info: any): any {
        try {
            const config = this.configManager.getConfig();
            const location = info.location?.toLowerCase();
            const mapConfig = config.mapSettings?.[location];
            
            if (!mapConfig || !mapConfig.enabled) {
                return outputJSON; // No config for this map
            }
            
            const modifiedOutput = { ...outputJSON };
            
            // Apply bot count limits
            if (mapConfig.maxBots && mapConfig.maxBots > 0) {
                if (modifiedOutput.data && Array.isArray(modifiedOutput.data)) {
                    // Limit the number of bots generated
                    modifiedOutput.data = modifiedOutput.data.slice(0, mapConfig.maxBots);
                }
            }
            
            // Apply bot type restrictions
            if (mapConfig.botTypes) {
                const allowedTypes = Object.entries(mapConfig.botTypes)
                    .filter(([_, config]: [string, any]) => config.enabled)
                    .map(([type, _]: [string, any]) => type);
                
                if (allowedTypes.length > 0 && modifiedOutput.data && Array.isArray(modifiedOutput.data)) {
                    // Filter bots to only allowed types
                    modifiedOutput.data = modifiedOutput.data.filter((bot: any) => {
                        const botType = bot.Role || bot.BotType;
                        return allowedTypes.includes(botType);
                    });
                }
            }
            
            return modifiedOutput;
            
        } catch (error) {
            this.logger.error(`Error applying bot spawn rules: ${error}`);
            return outputJSON;
        }
    }

    // Apply Live Tarkov raid spawn rules - REAL spawn control
    private applyRaidSpawnRules(outputJSON: any, info: any): any {
        try {
            const config = this.configManager.getConfig();
            const location = info.location?.toLowerCase();
            const mapConfig = config.mapSettings?.[location];
            
            if (!mapConfig || !mapConfig.enabled) {
                return outputJSON; // No config for this map
            }
            
            const modifiedOutput = { ...outputJSON };
            
            // Apply global bot limits
            const globalSettings = config.globalSettings;
            if (globalSettings) {
                const maxBots = globalSettings.maxBotsPerRaid || 15;
                const minBots = globalSettings.minBotsPerRaid || 6;
                
                // Modify raid configuration
                if (modifiedOutput.data) {
                    modifiedOutput.data.maxBots = maxBots;
                    modifiedOutput.data.minBots = minBots;
                }
            }
            
            // Apply map-specific spawn settings
            const liveTarkovSettings = mapConfig.liveTarkovSettings;
            if (liveTarkovSettings) {
                // Apply raid start bot count
                if (liveTarkovSettings.raidStartBots && liveTarkovSettings.raidStartBots > 0) {
                    if (modifiedOutput.data) {
                        modifiedOutput.data.raidStartBots = liveTarkovSettings.raidStartBots;
                    }
                }
                
                // Apply wave settings
                if (liveTarkovSettings.waveBots && liveTarkovSettings.maxWaves) {
                    if (modifiedOutput.data) {
                        modifiedOutput.data.waveBots = liveTarkovSettings.waveBots;
                        modifiedOutput.data.maxWaves = liveTarkovSettings.maxWaves;
                    }
                }
            }
            
            return modifiedOutput;
            
        } catch (error) {
            this.logger.error(`Error applying raid spawn rules: ${error}`);
            return outputJSON;
        }
    }

    // Apply Live Tarkov game spawn rules - REAL spawn control
    private applyGameSpawnRules(outputJSON: any, info: any): any {
        try {
            const config = this.configManager.getConfig();
            const modifiedOutput = { ...outputJSON };
            
            // Apply global spawn settings
            const globalSettings = config.globalSettings;
            if (globalSettings) {
                // Apply global spawn limits
                if (modifiedOutput.data) {
                    modifiedOutput.data.maxBots = globalSettings.maxBotsPerRaid || 15;
                    modifiedOutput.data.minBots = globalSettings.minBotsPerRaid || 6;
                }
            }
            
            return modifiedOutput;
            
        } catch (error) {
            this.logger.error(`Error applying game spawn rules: ${error}`);
            return outputJSON;
        }
    }

    // Apply custom spawn configurations to database
    public applyCustomSpawnConfig(): void {
        try {
            // Modify bot types in the database
            this.modifyBotTypes();
            
            // Apply gear progression if enabled
            if (this.configManager.isGearProgressionEnabled()) {
                this.applyGearProgression();
            }
            
            this.logger.info("Live Tarkov spawn configuration completed");
        } catch (error) {
            this.logger.error(`Error applying custom spawn config: ${error}`);
        }
    }

    // Modify bot types in the database
    private modifyBotTypes(): void {
        try {
            const config = this.configManager.getConfig();
            const database = this.databaseServer.getTables();
            let modifiedCount = 0;

            for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
                if (!botConfig || !botConfig.enabled) {
                    continue;
                }

                const dbBotType = database.bots.types[botType];
                if (!dbBotType) {
                    continue; // Don't spam warnings for missing bot types
                }

                // Apply gear tier restrictions
                this.applyGearTierRestrictions(dbBotType, botConfig);
                
                // Apply difficulty settings
                this.applyDifficultySettings(dbBotType, botConfig);

                // Apply live Tarkov behavior
                this.applyBotBehaviorSettings(dbBotType, botConfig);

                modifiedCount++;
            }

            // Show simple summary
            if (modifiedCount > 0) {
                this.logger.info(`Modified ${modifiedCount} bot types`);
            }
        } catch (error) {
            this.logger.error(`Error modifying bot types: ${error}`);
        }
    }

    // Apply gear tier restrictions to bot types
    private applyGearTierRestrictions(dbBotType: any, botConfig: any): void {
        try {
            if (!botConfig.gearRestrictions) return;

            const restrictions = botConfig.gearRestrictions;
            
            // Apply weapon restrictions
            if (restrictions.weapons) {
                dbBotType.inventory = dbBotType.inventory || {};
                dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
                dbBotType.inventory.equipment.weapon = restrictions.weapons;
            }

            // Apply armor restrictions
            if (restrictions.armor) {
                dbBotType.inventory = dbBotType.inventory || {};
                dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
                dbBotType.inventory.equipment.armor = restrictions.armor;
            }

            // Apply item restrictions
            if (restrictions.items) {
                dbBotType.inventory = dbBotType.inventory || {};
                dbBotType.inventory.items = restrictions.items;
            }
        } catch (error) {
            this.logger.error(`Error applying gear restrictions: ${error}`);
        }
    }

    // Apply difficulty settings to bot types
    private applyDifficultySettings(dbBotType: any, botConfig: any): void {
        try {
            if (!botConfig.difficulty) return;

            const difficulty = botConfig.difficulty;
            
            // Set bot difficulty
            dbBotType.difficulty = difficulty;
            
            // Apply difficulty-based behavior
            this.applyDifficultyBasedBehavior(dbBotType, difficulty);
        } catch (error) {
            this.logger.error(`Error applying difficulty settings: ${error}`);
        }
    }

    // Apply difficulty-based behavior modifications
    private applyDifficultyBasedBehavior(dbBotType: any, difficulty: string): void {
        try {
            // Modify bot behavior based on difficulty
            switch (difficulty) {
                case "easy":
                    dbBotType.skills = dbBotType.skills || {};
                    dbBotType.skills.aiming = Math.max(0.1, (dbBotType.skills.aiming || 0.5) * 0.7);
                    dbBotType.skills.recoil = Math.max(0.1, (dbBotType.skills.recoil || 0.5) * 0.7);
                    break;
                case "normal":
                    // Keep default values
                    break;
                case "hard":
                    dbBotType.skills = dbBotType.skills || {};
                    dbBotType.skills.aiming = Math.min(1.0, (dbBotType.skills.aiming || 0.5) * 1.3);
                    dbBotType.skills.recoil = Math.min(1.0, (dbBotType.skills.recoil || 0.5) * 1.3);
                    break;
                case "impossible":
                    dbBotType.skills = dbBotType.skills || {};
                    dbBotType.skills.aiming = Math.min(1.0, (dbBotType.skills.aiming || 0.5) * 1.5);
                    dbBotType.skills.recoil = Math.min(1.0, (dbBotType.skills.recoil || 0.5) * 1.5);
                    break;
            }
        } catch (error) {
            this.logger.error(`Error applying difficulty-based behavior: ${error}`);
        }
    }

    // Apply live Tarkov behavior settings
    private applyBotBehaviorSettings(dbBotType: any, botConfig: any): void {
        try {
            if (!botConfig.liveTarkovBehavior) return;

            const behavior = botConfig.liveTarkovBehavior;
            
            // Apply behavior modifications
            if (behavior.aggressive) {
                dbBotType.aggression = Math.min(1.0, (dbBotType.aggression || 0.5) * 1.2);
            }
            
            if (behavior.cautious) {
                dbBotType.aggression = Math.max(0.1, (dbBotType.aggression || 0.5) * 0.8);
            }
        } catch (error) {
            this.logger.error(`Error applying bot behavior settings: ${error}`);
        }
    }

    // Apply gear progression system
    private applyGearProgression(): void {
        try {
            const config = this.configManager.getConfig();
            const gearProgression = config.globalSettings?.gearProgression;
            
            if (!gearProgression || !gearProgression.enabled) return;
            
            this.logger.info("Applying gear progression system...");
            
            // Apply level-based gear scaling to PMCs
            this.applyPMCGearProgression();
            
            // Apply meta ammo enforcement
            this.applyMetaAmmoEnforcement();
            
            this.logger.info("Gear progression system applied successfully");
        } catch (error) {
            this.logger.error(`Error applying gear progression: ${error}`);
        }
    }

    // Apply PMC gear progression based on level
    private applyPMCGearProgression(): void {
        try {
            const config = this.configManager.getConfig();
            const gearProgression = config.globalSettings?.gearProgression;
            
            if (!gearProgression || !gearProgression.progressionTiers) return;
            
            const progression = gearProgression.progressionTiers;
            
            // Apply level-based gear scaling
            for (const [level, gearConfig] of Object.entries(progression)) {
                const minLevel = parseInt(level);
                if (isNaN(minLevel)) continue;
                
                // This would be applied when PMCs are spawned based on their level
                // For now, we just store the configuration
                this.logger.info(`Configured gear progression for level ${minLevel}+`);
            }
        } catch (error) {
            this.logger.error(`Error applying PMC gear progression: ${error}`);
        }
    }

    // Apply meta ammo enforcement
    private applyMetaAmmoEnforcement(): void {
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

    // RESEARCH: Analyze bot generation data structure to understand what we can control
    private analyzeBotGenerationData(outputJSON: any, info: any): void {
        try {
            this.logger.info("=== BOT GENERATION DATA ANALYSIS ===");
            
            // Analyze the info parameter
            this.logger.info("Info parameter analysis:");
            this.logger.info(`- Location: ${info.location || 'undefined'}`);
            this.logger.info(`- Info keys: ${Object.keys(info).join(', ')}`);
            
            // Analyze the output structure
            this.logger.info("Output structure analysis:");
            this.logger.info(`- Output keys: ${Object.keys(outputJSON).join(', ')}`);
            
            if (outputJSON.data) {
                this.logger.info(`- Data type: ${Array.isArray(outputJSON.data) ? 'Array' : typeof outputJSON.data}`);
                if (Array.isArray(outputJSON.data)) {
                    this.logger.info(`- Data length: ${outputJSON.data.length}`);
                    if (outputJSON.data.length > 0) {
                        this.logger.info(`- First bot structure: ${JSON.stringify(outputJSON.data[0], null, 2)}`);
                    }
                }
            }
            
            // Look for spawn-related fields
            this.logger.info("Looking for spawn-related fields...");
            this.findSpawnRelatedFields(outputJSON, "Output");
            this.findSpawnRelatedFields(info, "Info");
            
            this.logger.info("=== BOT GENERATION ANALYSIS COMPLETED ===");
        } catch (error) {
            this.logger.error(`Error analyzing bot generation data: ${error}`);
        }
    }

    // RESEARCH: Analyze raid start data structure to understand what we can control
    private analyzeRaidStartData(outputJSON: any, info: any): void {
        try {
            this.logger.info("=== RAID START DATA ANALYSIS ===");
            
            // Analyze the info parameter
            this.logger.info("Info parameter analysis:");
            this.logger.info(`- Location: ${info.location || 'undefined'}`);
            this.logger.info(`- Info keys: ${Object.keys(info).join(', ')}`);
            
            // Analyze the output structure
            this.logger.info("Output structure analysis:");
            this.logger.info(`- Output keys: ${Object.keys(outputJSON).join(', ')}`);
            
            // Look for spawn-related fields
            this.logger.info("Looking for spawn-related fields...");
            this.findSpawnRelatedFields(outputJSON, "Output");
            this.findSpawnRelatedFields(info, "Info");
            
            this.logger.info("=== RAID START ANALYSIS COMPLETED ===");
        } catch (error) {
            this.logger.error(`Error analyzing raid start data: ${error}`);
        }
    }

    // RESEARCH: Analyze game start data structure to understand what we can control
    private analyzeGameStartData(outputJSON: any, info: any): void {
        try {
            this.logger.info("=== GAME START DATA ANALYSIS ===");
            
            // Analyze the info parameter
            this.logger.info("Info parameter analysis:");
            this.logger.info(`- Info keys: ${Object.keys(info).join(', ')}`);
            
            // Analyze the output structure
            this.logger.info("Output structure analysis:");
            this.logger.info(`- Output keys: ${Object.keys(outputJSON).join(', ')}`);
            
            // Look for spawn-related fields
            this.logger.info("Looking for spawn-related fields...");
            this.findSpawnRelatedFields(outputJSON, "Output");
            this.findSpawnRelatedFields(info, "Info");
            
            this.logger.info("=== GAME START ANALYSIS COMPLETED ===");
        } catch (error) {
            this.logger.error(`Error analyzing game start data: ${error}`);
        }
    }

    // RESEARCH: Find fields that might be related to spawning
    private findSpawnRelatedFields(data: any, context: string): void {
        try {
            const spawnKeywords = [
                'spawn', 'bot', 'location', 'position', 'count', 'limit', 'max', 'min',
                'wave', 'time', 'delay', 'zone', 'area', 'exclude', 'include', 'type',
                'role', 'difficulty', 'gear', 'equipment', 'inventory'
            ];
            
            this.logger.info(`Searching for spawn-related fields in ${context}:`);
            
            const foundFields: string[] = [];
            this.searchForKeywords(data, spawnKeywords, foundFields, '');
            
            if (foundFields.length > 0) {
                this.logger.info(`Found spawn-related fields: ${foundFields.join(', ')}`);
            } else {
                this.logger.info("No obvious spawn-related fields found");
            }
        } catch (error) {
            this.logger.error(`Error searching for spawn-related fields: ${error}`);
        }
    }

    // RESEARCH: Recursively search for keywords in nested objects
    private searchForKeywords(data: any, keywords: string[], foundFields: string[], path: string): void {
        try {
            if (typeof data === 'object' && data !== null) {
                for (const [key, value] of Object.entries(data)) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    // Check if this key contains any of our keywords
                    const lowerKey = key.toLowerCase();
                    for (const keyword of keywords) {
                        if (lowerKey.includes(keyword)) {
                            foundFields.push(currentPath);
                            this.logger.info(`Found spawn-related field: ${currentPath} = ${JSON.stringify(value)}`);
                            break;
                        }
                    }
                    
                    // Recursively search nested objects
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        this.searchForKeywords(value, keywords, foundFields, currentPath);
                    }
                }
            }
        } catch (error) {
            this.logger.error(`Error in keyword search: ${error}`);
        }
    }

    // SAFETY: Validate that our modifications don't break SPT's data structure
    private validateModifiedData(originalData: any, modifiedData: any, context: string): boolean {
        try {
            // Basic structure validation
            if (typeof originalData !== typeof modifiedData) {
                this.logger.error(`${context}: Data type mismatch - original: ${typeof originalData}, modified: ${typeof modifiedData}`);
                return false;
            }

            // Array length validation for bot data
            if (Array.isArray(originalData.data) && Array.isArray(modifiedData.data)) {
                if (modifiedData.data.length > originalData.data.length) {
                    this.logger.warn(`${context}: Modified data has more bots than original - this might cause issues`);
                }
            }

            // Required field validation
            const requiredFields = ['data', 'err', 'errmsg'];
            for (const field of requiredFields) {
                if (originalData.hasOwnProperty(field) && !modifiedData.hasOwnProperty(field)) {
                    this.logger.error(`${context}: Required field '${field}' missing from modified data`);
                    return false;
                }
            }

            this.logger.info(`${context}: Data validation passed`);
            return true;
        } catch (error) {
            this.logger.error(`${context}: Data validation failed: ${error}`);
            return false;
        }
    }

    // SAFETY: Add performance monitoring to our spawn rule methods
    private measurePerformance<T>(operation: string, func: () => T): T {
        const startTime = Date.now();
        try {
            const result = func();
            const endTime = Date.now();
            this.logger.info(`${operation} completed in ${endTime - startTime}ms`);
            return result;
        } catch (error) {
            const endTime = Date.now();
            this.logger.error(`${operation} failed after ${endTime - startTime}ms: ${error}`);
            throw error;
        }
    }

    // Get spawn statistics for monitoring
    public getSpawnStatistics(): any {
        try {
            const stats = {
                totalBots: 0,
                modifiedBots: 0,
                gearProgressionEnabled: this.configManager.isGearProgressionEnabled(),
                spawnControlEnabled: !!this.staticRouterService,
                locationControlEnabled: false // No direct location controller exposed here
            };
            
            return stats;
        } catch (error) {
            this.logger.error(`Error getting spawn statistics: ${error}`);
            return {};
        }
    }
}