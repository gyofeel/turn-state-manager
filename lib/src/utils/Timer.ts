type TimerId = number | null;
type TimerOptions = {
    callbackFunction?: Function,
    duration?: number,
    args?: any[],
}

export class Timer {
    constructor(options:TimerOptions, timerCallback?: Function) {
        this.setOptions(options);
        this.setTimerCallback(timerCallback);
    }

    private static INTERVAL_DURATION = 100;
    private time = 0;
    private timerCallback:Function = () => {};
    private id: TimerId = null;
    private options: TimerOptions = {
        callbackFunction: () => {},
        duration: 3000,
        args: [],
    };

    private timerHandler() {
        this.time += Timer.INTERVAL_DURATION;
        this.timerCallback({
            timerCount: this.time,
        });
        const remainedTime = this.options.duration! - this.time;
        if (remainedTime <= 0) {
            this.remove();
            this.options.callbackFunction!(...this.options.args!);
        }
    }
    private setTimerCallback(callback: Function | undefined) {
        if (callback) {
            this.timerCallback = callback;
        }
    }
    public setOptions(options: TimerOptions) {
        this.options = {
            ...this.options,
            ...options
        };
        this.options.duration = this.transformDuration(this.options.duration!);
        this.remove();
    }
    public init() {
        this.remove();
        this.id = setInterval(this.timerHandler.bind(this), Timer.INTERVAL_DURATION);
    }
    public reInit() {
        this.init();
    }
    public remove() {
        this.time = 0;
        if (this.id) {
            clearInterval(this.id);
        }
    }
    private transformDuration(duration:number) {
        return duration / Timer.INTERVAL_DURATION * 100;
    }
}