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
        turnIndex: 0,
        turnNumber: -1,
        turnTime: -1,
        totalTime: -1,
        turnTimeTickCallback: () => {},
        totalTimeTickCallback: () => {},
        auto: false,
        loop: false
    }
    private callbackFunctions: CallbackFunctions = {};
    private turnIndex: number = 0;
    private gameTimer: Timer | null = null;
    private turnTimer: Timer | null = null;

    // Initial Game
    private initialize(options: Options) {
        this.isInit = true;
        this.setOptions(options);
        this.gameTimer = new Timer({
            callbackFunction: this.emit.bind(this),
            duration: this.options.totalTime,
            args: [EVENT.END],
        }, this.options.totalTimeTickCallback?.bind(this));
        this.turnTimer = new Timer({
            callbackFunction: this.emit.bind(this),
            duration: this.options.turnTime,
            args: [this.autoDirection],
        }, this.options.turnTimeTickCallback?.bind(this));
    }

    public setOptions(options: Options) {
        if (options.turnNumber && options.turnNumber <= 0) {
            options.turnNumber = -1;
        }
        if (options.turnIndex && options.turnIndex < 0) {
            options.turnIndex = 0;
        }
        if (options.turnIndex && options.turnNumber) {
            if (options.turnIndex + 1 > options.turnNumber) {
                options.turnIndex = options.turnNumber - 1;
            }
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
        const { auto, turnTime, totalTime } = this.options;
        this.emit(EVENT.START);
        if (auto && turnTime! > 0 && this.turnTimer) {
            this.turnTimer.init();
        }
        if (totalTime !> 0 && this.gameTimer) {
            this.gameTimer.init();
        }
    }

    // Set Event
    public on(eventName: EventName, callback: CallbackFunction) {
        console.log('called on(): eventName - ', eventName);
        this.callbackFunctions[eventName] = callback;
    }

    public emit(eventName: EventName) {
        const { loop, turnNumber, auto } = this.options;
        console.log('called emit(): eventName - ', eventName);
        if (eventName === EVENT.NEXT_TURN) {
            let nextIdx = this.turnIndex + 1;
            if (turnNumber! > 0 && nextIdx + 1 > turnNumber!) {
                nextIdx = loop ? 0 : this.turnIndex;
            }
            this.setTurnIndex(nextIdx);
        } else if (eventName === EVENT.PREV_TURN) {
            let prevIdx = this.turnIndex - 1;
            if (prevIdx < 0) {
                prevIdx = turnNumber! > 0 && loop ? turnNumber! - 1 : 0;
            }
            this.setTurnIndex(prevIdx);
        } else if (eventName === EVENT.COMPLETE) {
            if (auto && loop) {
                this.turnTimer?.init();
            }
            return;
        } else if (eventName === EVENT.END) {
            this.turnTimer?.remove();
            this.gameTimer?.remove();
            return;
        }
        if (this.turnTimer && auto && (eventName === EVENT.NEXT_TURN || eventName === EVENT.PREV_TURN)) {
            if (eventName !== this.autoDirection) {
                this.autoDirection = eventName;
                this.turnTimer.setOptions({
                    args: [this.autoDirection]
                });
            }
            this.turnTimer.init();
        }
        
        if (turnNumber! > 0 && (this.turnIndex + 1) >= turnNumber!) {
            if (loop) {
                this.emit(EVENT.COMPLETE)
            } else {
                this.emit(EVENT.END);
            }
        }

        if (this.callbackFunctions[eventName]) {
            const arg = {
                type: eventName,
                index: this.turnIndex,
                this: this
            };
            (this.callbackFunctions[eventName]!)(arg);
        }
        console.log('turnIndex - ', this.getTurnIndex());
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