// SPT Type Definitions for Live Tarkov AI Mod
// These interfaces match the actual SPT API structure

export interface IPreSptLoadMod {
    preSptLoad(container: DependencyContainer): void;
}

export interface IPostDBLoadMod {
    postDBLoad(container: DependencyContainer): void;
}

export interface DependencyContainer {
    resolve<T>(token: string): T;
    afterResolution<T>(token: string, callback: (token: string, result: T) => void, options?: any): void;
}

export interface DatabaseServer {
    getTables(): {
        bots: {
            types: { [key: string]: IBotType };
            base: { [key: string]: IBotBase };
        };
        locations: {
            base: { [key: string]: ILocationBase };
        };
    };
}

export interface ConfigServer {
    getConfig<T>(configType: string): T;
}

export interface ILocationBase {
    Name: string;
    Base: {
        Name: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface IRaidChanges {
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

export interface IBotType {
    _id: string;
    Name: string;
    Role: string;
    Difficulty: BotDifficulty;
    BotType: BotType;
    Health: number[];
    Experience: number;
    [key: string]: any;
}

export interface IBotBase {
    _id: string;
    Name: string;
    Role: string;
    Difficulty: BotDifficulty;
    BotType: BotType;
    Health: number[];
    Experience: number;
    [key: string]: any;
}

export enum BotDifficulty {
    EASY = "easy",
    NORMAL = "normal", 
    HARD = "hard",
    IMPOSSIBLE = "impossible"
}

export enum BotType {
    ASSAULT = "assault",
    PMCBEAR = "pmcbear",
    PMCUSEC = "pmcusec",
    BOSS = "boss",
    FOLLOWER = "follower",
    SCAV = "scav"
}

export enum EquipmentSlots {
    HEAD = "Head",
    EARS = "Ears", 
    EYES = "Eyes",
    FACE = "Face",
    BODY = "Body",
    ARMS = "Arms",
    HANDS = "Hands",
    LEGS = "Legs",
    FEET = "Feet",
    BACKPACK = "Backpack",
    POCKETS = "Pockets",
    SECURED = "Secured"
}

export interface BotHelper {
    getBotTemplate(role: string): IBotType;
    getBotTemplateByRole(role: string): IBotType;
    getBotTemplateByType(type: BotType): IBotType[];
    getRandomizedBotTemplate(role: string): IBotType;
}

export interface BotEquipmentModService {
    generateEquipment(botRole: string, botLevel: number, botType: BotType): any;
    generateWeapon(botRole: string, botLevel: number): any;
    generateArmor(botRole: string, botLevel: number): any;
    generateItems(botRole: string, botLevel: number): any[];
}

export interface BotModificationService {
    modifyBot(bot: IBotBase, modifications: any): void;
    setBotDifficulty(bot: IBotBase, difficulty: BotDifficulty): void;
    setBotAccuracy(bot: IBotBase, accuracy: number): void;
    setBotReactionTime(bot: IBotBase, reactionTime: number): void;
    setBotAggression(bot: IBotBase, aggression: number): void;
}

export interface BotSpawnService {
    spawnBot(botType: string, location: string, count: number): Promise<any[]>;
    getSpawnPoints(mapName: string): any[];
    calculateBotCount(mapName: string, botType: string): number;
}

export interface BotGenerationCacheService {
    getCachedBot(role: string, level: number): IBotBase | null;
    cacheBot(role: string, level: number, bot: IBotBase): void;
    clearCache(): void;
}

export interface LocationController {
    getLocation(locationName: string): ILocationBase;
    getAllLocations(): ILocationBase[];
    getSpawnPoints(locationName: string): any[];
    modifyLocationSpawns(locationName: string, modifications: any): void;
}

export interface BotController {
    getBots(): IBotBase[];
    getBotById(id: string): IBotBase | null;
    modifyBot(id: string, modifications: any): void;
    removeBot(id: string): void;
}

export interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
}

export interface RandomUtil {
    getInt(min: number, max: number): number;
    getFloat(min: number, max: number): number;
    getBool(): boolean;
    getArrayValue<T>(array: T[]): T;
    getWeightedRandomValue<T>(items: { item: T; weight: number }[]): T;
}

export interface TimeUtil {
    getTimestamp(): number;
    getTimeString(): string;
    getRaidTime(): number;
    isNightRaid(): boolean;
}

export interface JsonUtil {
    serialize(obj: any): string;
    deserialize<T>(json: string): T;
    clone<T>(obj: T): T;
}

export interface ItemHelper {
    getItem(itemId: string): any;
    getItemByTpl(tpl: string): any;
    isItemOfType(item: any, type: string): boolean;
    getItemPrice(itemId: string): number;
    getItemWeight(itemId: string): number;
}

export interface ICoreConfig {
    version: string;
    [key: string]: any;
}

export enum ConfigTypes {
    CORE = "CORE",
    BOTS = "BOTS",
    LOCATIONS = "LOCATIONS",
    SPAWNS = "SPAWNS"
}

export interface FileSystemSync {
    readFile(filePath: string): string;
    writeFile(filePath: string, content: string): void;
    exists(filePath: string): boolean;
    mkdir(dirPath: string): void;
}
