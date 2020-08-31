import { Options, EventName, CallbackFunction, CallbackFunctions } from './config/types';
import { EVENT } from './config/constants';
import { Timer } from './utils/Timer';

export class TurnGame {
    public constructor(options: Options) {
        this.initialize(options);
    }

    private isInit: boolean = false;
    private autoDirection :EventName = EVENT.NEXT_TURN;
    private options: Options = {
        turnTime: 3000,
        turnIndex: 0,
        turnNumber: -1,
        totalTime: -1,
        auto: false,
        loop: false
    }
    private callbackFunctions: CallbackFunctions = {};
    private turnIndex: number = 0;
    private timer: Timer | null = null;

    // Initial Game
    private initialize(options: Options) {
        this.isInit = true;
        this.setOptions(options);
        this.timer = new Timer({
            callbackFunction: this.emit,
            delay: this.options.turnTime,
            args: [this.autoDirection]
        });
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

    public start() {
        if (!this.isInit) {
            throw new RangeError('Initialize a TurnGame instance before starting.');
        }
        const { auto } = this.options;
        this.emit(EVENT.START);
        if (auto && this.timer) {
            this.timer.init();
        }
    }

    // Set Event
    public on(eventName: EventName, callback: CallbackFunction) {
        this.callbackFunctions[eventName] = callback;
    }

    public emit(eventName: EventName) {
        const { loop, turnNumber } = this.options;

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
        if (this.options.auto && (eventName === EVENT.NEXT_TURN || eventName === EVENT.PREV_TURN)) {
            if (this.timer && eventName !== this.autoDirection) {
                this.autoDirection = eventName;
                this.timer.setOptions({
                    args: [this.autoDirection]
                });
                this.timer.init();
            }
        }
        
        if (turnNumber! > 0) {
            if (loop) {
                this.emit(EVENT.COMPLETE)
            }
            this.emit(EVENT.END);
        }

        if (this.callbackFunctions[eventName]) {
            const arg = {
                type: eventName,
                index: this.turnIndex,
                this: this
            };
            (this.callbackFunctions[eventName]!)(arg);
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