import { Options, EventName, CallbackFunction, CallbackFunctions } from './config/types';
import { EVENT } from './config/constants';
import { Timer } from './utils/Timer';

export class TurnGame {
    public constructor(options: Options) {
        this.initialize(options);
    }
    private static TIMER_OFFSET_VALUE = 150;
    // private isInit: boolean = false;
    private autoDirection: EventName = EVENT.NEXT_TURN;
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
    private prevTurnIndex: number = 0;
    private gameTimer: Timer | null = null;
    private turnTimer: Timer | null = null;
    private turnOverTime: number = Date.now();
    // Initial Game
    private initialize(options: Options) {
        // this.isInit = true;
        this.setOptions(options);
    }

    private setOptions(options: Options) {
        if (options.turnIndex) {
            options.turnIndex = options.turnIndex < 0 ? 0 : options.turnIndex;
        }
        if (options.turnNumber) {
            options.turnNumber = options.turnNumber <= 0 ? -1 : options.turnNumber;
        }
        if (options.turnIndex && options.turnNumber) {
            options.turnIndex = options.turnIndex + 1 > options.turnNumber ? options.turnNumber - 1 : options.turnNumber;
        }
        this.options = {
            ...this.options,
            ...options
        }
        // set a value of the default options
        this.turnIndex = this.options.turnIndex || 0;
    }

    public start() {
        // if (!this.isInit) {
        //     throw new RangeError('Initialize a TurnGame instance before starting.');
        // }
        this.emit(EVENT.START);
    }

    // Set Event
    public on(eventName: EventName, callback: CallbackFunction) {
        // console.log('called on(): eventName - ', eventName);
        this.callbackFunctions[eventName] = callback;
    }

    public emit(eventName: EventName) {
        // console.log('called emit(): eventName - ', eventName);
        if (eventName === EVENT.COMPLETE) {
            return;
        }
        this.controllGame(eventName);
        this.callEventCallback(eventName);
        this.fixAutoDirection(eventName);
    }

    public getTurnIndex() {
        return this.turnIndex;
    }

    public setLoopOption(isLoop: boolean) {
        this.options.loop = isLoop;
    }

    public setAutoOption(isAuto: boolean) {
        this.options.auto = isAuto;
        if (isAuto) {
            this.setTurnTimer();
            this.startTurnTimer();
            return;
        }
        this.turnTimer?.remove();
    }
    
    private setGameTimer() {
        this.gameTimer = new Timer({
            callbackFunction: this.emit.bind(this),
            duration: this.options.totalTime,
            args: [EVENT.END],
        }, this.options.totalTimeTickCallback?.bind(this));
    }

    private setTurnTimer() {
        this.turnTimer = new Timer({
            callbackFunction: this.emit.bind(this),
            duration: this.options.turnTime,
            args: [this.autoDirection],
        }, this.options.turnTimeTickCallback?.bind(this));
    }

    private startTimers() {
        const { auto, turnTime, totalTime } = this.options;

        if (auto && turnTime! > 0 && this.turnTimer) {
            this.turnTimer.init();
        }
        if (totalTime !> 0 && this.gameTimer) {
            this.gameTimer.init();
        }
    }

    private callEventCallback(eventName: EventName) {
        if (this.callbackFunctions[eventName]) {
            const arg = {
                type: eventName,
                index: this.turnIndex,
                this: this
            };
            (this.callbackFunctions[eventName]!)(arg);
        }
    }

    private controllGame(eventName: EventName) {
        const { loop, turnNumber, auto } = this.options;
        if (eventName === EVENT.START) {
            this.setGameTimer();
            this.setTurnTimer();
            this.startGameTimer();
            this.startTurnTimer();
        } else if (eventName === EVENT.NEXT_TURN) {
            let nextIdx = this.turnIndex + 1;
            if (turnNumber! > 0 && nextIdx > turnNumber! - 1) {
                if (loop) {
                    this.emitCompleteEvent();
                    nextIdx = 0;
                } else {
                    this.emit(EVENT.END);
                    nextIdx = this.turnIndex;
                }
            }
            this.prevTurnIndex = this.turnIndex;
            this.turnOverTime = Date.now();
            this.turnIndex = nextIdx;
            return;
        } else if (eventName === EVENT.PREV_TURN) {
            let prevIdx = this.turnIndex - 1;
            if (turnNumber! > 0 && prevIdx < 0) {
                prevIdx = loop ? turnNumber! - 1 : 0;
            }
            this.turnOverTime = Date.now();
            this.prevTurnIndex = this.turnIndex;
            this.turnIndex = prevIdx;
            return;
        } else if (eventName === EVENT.COMPLETE) {
            if (auto && loop) {
                this.turnTimer?.init();
            }
            return;
        } else if (eventName === EVENT.END) {
            this.gameTimer?.remove();
            this.turnTimer?.remove();
            this.gameTimer = null;
            this.turnTimer = null;
            if (Date.now() - this.turnOverTime < TurnGame.TIMER_OFFSET_VALUE) {
                this.turnIndex = this.prevTurnIndex;
            }
            return;
        }
    }

    private fixAutoDirection(eventName: EventName) {
        const { auto } = this.options;

        if (auto && this.turnTimer && (eventName === EVENT.NEXT_TURN || eventName === EVENT.PREV_TURN)) {
            if (eventName !== this.autoDirection) {
                this.autoDirection = eventName;
                this.turnTimer.setOptions({
                    args: [this.autoDirection]
                });
            }
            this.turnTimer.init();
        }
    }

    private emitCompleteEvent() {
        this.callEventCallback(EVENT.COMPLETE);
        this.controllGame(EVENT.COMPLETE);
    }
}