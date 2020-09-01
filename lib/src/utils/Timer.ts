type TimerId = number | null;
type TimerOptions = {
    callbackFunction?: Function,
    delay?: number,
    args?: any[]
}

export class Timer {
    constructor(options:TimerOptions) {
        this.setOptions(options);
    }
    private id: TimerId = null;
    private options: TimerOptions = {
        callbackFunction: () => {},
        delay: 3000,
        args: []
    };

    public setOptions(options: TimerOptions) {
        this.options = {
            ...this.options,
            ...options
        };
        console.log('called setOptions(): this.options - ', this.options);
    }
    public init() {
        const { callbackFunction, delay, args } = this.options;
        this.remove();
        this.id = setInterval(callbackFunction!, delay, ...args!);
    }
    public remove() {
        if (this.id) {
            clearInterval(this.id);
        }
    }
    
}