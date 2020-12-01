import { TurnGame } from '../TurnGame';

type Game = TurnGame;
type GameId = string | number | Symbol;
type GameMaps = Map<GameId, Game>;
type Options = {
    turnIndex?: number,
    turnNumber?: number,
    turnTime?: number,
    totalTime?: number,
    turnTimeTickCallback?: Function,
    totalTimeTickCallback?: Function,
    auto?: boolean,
    loop?: boolean
};
type Event = {
    START: 'start',
    PREV_TURN: 'prev-turn',
    NEXT_TURN: 'next-turn',
    COMPLETE: 'complete',
    END: 'end'
};
type EventName = Event[keyof Event];
type CallbackFunction = (arg: any) => any;
type CallbackFunctions = {
    [eventName in EventName]?: CallbackFunction
};

export type { Game, GameId, GameMaps, Options, Event, EventName, CallbackFunction, CallbackFunctions };