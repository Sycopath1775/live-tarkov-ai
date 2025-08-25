import { SpawnManager } from "./SpawnManager";
import { ConfigManager } from "./ConfigManager";
import {
    IPreSptLoadMod,
    IPostDBLoadMod,
    DependencyContainer,
    DatabaseServer,
    Logger
} from "./types/spt-types";

class LiveTarkovAIMod implements IPreSptLoadMod, IPostDBLoadMod
{
    private spawnManager: SpawnManager | null = null;
    private configManager: ConfigManager | null = null;
    private logger: Logger;

    constructor() {
        // Create a simple logger
        this.logger = {
            info: (msg: string) => console.log(`[LiveTarkovAI] ${msg}`),
            warn: (msg: string) => console.warn(`[LiveTarkovAI] ${msg}`),
            error: (msg: string) => console.error(`[LiveTarkovAI] ${msg}`),
            debug: (msg: string) => console.log(`[LiveTarkovAI] [DEBUG] ${msg}`)
        };
    }

    // PreSPTLoad - Initialize mod and configuration
    public preSptLoad(container: DependencyContainer): void 
    {
        try {
            this.logger.info("Initializing Live Tarkov - AI Mod...");
            
            // Initialize configuration
            this.configManager = new ConfigManager();
            this.configManager.initialize();
            
            this.logger.info("Live Tarkov - AI Mod initialized successfully!");
        } catch (error) {
            this.logger.error(`Error during preSptLoad: ${error}`);
        }
    }

    // PostDBLoad - Configure spawn data after database is loaded
    public postDBLoad(container: DependencyContainer): void 
    {
        try {
            this.logger.info("Configuring live Tarkov spawn data...");
            
            // Get required services from container
            const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
            
            // Initialize spawn manager
            this.spawnManager = new SpawnManager(
                databaseServer,
                this.configManager!,
                this.logger
            );
            this.spawnManager.initialize();
            
            // Apply custom spawn configurations
            this.spawnManager.applyCustomSpawnConfig();
            
            this.logger.info("Live Tarkov spawn data configuration completed!");
        } catch (error) {
            this.logger.error(`Error during postDBLoad: ${error}`);
        }
    }
}

// Export the mod instance for SPT to load
export const mod = new LiveTarkovAIMod();
