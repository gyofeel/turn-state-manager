import { Options, EventName, CallbackFunction, CallbackFunctions } from './config/types';
import { EVENT } from './config/constants';

export class TurnGame {
    public constructor(options: Options) {
        this.initialize(options);
    }

    private options: Options = {
        turnTime: 3000,
        turnIndex: 0,
        turnNumber: -1,
        totalTime: -1,
        autoTurnover: false,
        loop: false
    }
    private callbackFunctions: CallbackFunctions = {};
    private turnIndex = 0;


    // Initial Game
    private initialize(options: Options) {
        this.setOptions(options);
    }

    public setOptions(options: Options) {
        if (options.turnNumber === 0) {
            options.turnNumber = -1;
        }
        this.options = {
            ...this.options,
            ...options
        }
        // TODO: call funtions to set a value of the default options.
        this.setTurnIndex(this.options.turnIndex || 0);
    }

    // Set Event
    public on(eventName: EventName, callback: CallbackFunction) {
        this.callbackFunctions[eventName] = callback;
    }

    public emit(eventName: EventName, arg: any) {
        const { loop, turnNumber } = this.options;
        
        if (this.callbackFunctions[eventName]) {
            (this.callbackFunctions[eventName]!)(arg);
        }
        
        if (eventName === EVENT.NEXT_TURN) {
            let nextIdx = this.turnIndex + 1;
            if (turnNumber! > 0 && loop) {
                nextIdx = nextIdx + 1 >= turnNumber! ? 0 : nextIdx;
            }
            this.setTurnIndex(nextIdx);
        } else if (eventName === EVENT.PREV_TURN) {
            let prevIdx = this.turnIndex - 1;
            if (prevIdx < 0) {
                prevIdx = turnNumber! > 0 && loop ? turnNumber! - 1 : 0;
            }
            this.setTurnIndex(prevIdx);
        }
        
        if (turnNumber! > 0) {
            if (loop) {
                this.emit(EVENT.COMPLETE, null)
            }
            this.emit(EVENT.END, null);
        }
    }

    // Turn Index
    private setTurnIndex(index: number) {
        this.turnIndex = index;
    }

    public getTurnIndex() {
        return this.turnIndex;
    }
    // Controll Game
}