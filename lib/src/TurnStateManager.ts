import { GameMaps, GameId, Game, Options } from './config/types';
import { TurnGame } from './TurnGame';

export class TurnStateManager {
    // the single ton object.
    private static turnStateManager:TurnStateManager;

    private constructor() {}

    private gameMaps:GameMaps = new Map();
    
    public getInstance(): TurnStateManager {
        if (!TurnStateManager.turnStateManager) {
            TurnStateManager.turnStateManager = new TurnStateManager();
        }
        return TurnStateManager.turnStateManager;
    }

    public setGame(id:GameId, options:Options): boolean {
        const game = new TurnGame(options);
        this.gameMaps.set(id, game);
        return true;
    }

    public getGameFromId(id:GameId): Game {
        const res = this.gameMaps.get(id);
        if (!res) {
            return null;
        }
        return res;
    }

    public getGamesAll(): Game[] {
        const res = this.gameMaps.values();
        return Array.from(res);
    }

    public getGameIdsAll(): GameId[] {
        const res = this.gameMaps.keys();
        return Array.from(res);
    }

    public removeGame(id:GameId): boolean {
        if (this.gameMaps.has(id)) {
            return this.gameMaps.delete(id);
        }
        return false;
    }

    public clearGames() {
        this.gameMaps.clear();
    } 
}
