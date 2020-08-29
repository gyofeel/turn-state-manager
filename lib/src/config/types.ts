import { TurnGame } from '../TurnGame';

type Game = TurnGame | null;
type GameId = string | number | Symbol;
type GameMaps = Map<GameId, Game>;
type Options = {
    turnNumber?: number,
    turnTime: number,
    totalTime?: number,
    autoTurnover?: boolean,
    loop?: boolean
};
type Event = {
    START: 'start',
    NEXT_TURN: 'next-turn',
    COMPLETE: 'complete',
    END: 'end'
};
type EventName = Event[keyof Event];
type CallbackFunction = (arg: any) => {};
type CallbackFunctions = {
    [eventName in EventName]?: CallbackFunction
};

export type { Game, GameId, GameMaps, Options, Event, EventName, CallbackFunction, CallbackFunctions };