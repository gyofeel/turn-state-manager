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
    }
    public init() {
        const { callbackFunction, delay } = this.options;
        this.remove();
        this.id = setInterval(callbackFunction!, delay);
    }
    public remove() {
        if (this.id) {
            clearInterval(this.id);
        }
    }
    
}