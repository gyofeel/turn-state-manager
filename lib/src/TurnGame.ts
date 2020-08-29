import { Options, EventName, CallbackFunction, CallbackFunctions } from './config/types';

export class TurnGame {
    public constructor(options: Options) {
        this.initialize(options);
    }

    private options: Options = {
        turnNumber: -1,
        turnTime: 3000,
        totalTime: -1,
        autoTurnover: false,
        loop: false
    }
    private callbackFunctions: CallbackFunctions = {};

    private initialize(options: Options) {
        this.setOptions(options);
    }

    public setOptions(options: Options) {
        this.options = options;
    }

    public on(eventName: EventName, callback: CallbackFunction) {
        this.callbackFunctions[eventName] = callback;
    }

    public emit(eventName: EventName, arg: any) {
        if (this.callbackFunctions[eventName]) {
            (this.callbackFunctions[eventName]!)(arg);
        }
    }
}