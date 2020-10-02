import { ISuggestion } from "../components/Chat/ChatBoxArea/SuggestionBox";


export class SuggestionManager {
    setState: (suggestions: Array<ISuggestion>) => void
    globalMatch?: (value: string) => boolean
    _handlers: Map<string, ISuggestionHandler>
    lastMatchedValue?: string
    constructor(setState: (suggestions: Array<ISuggestion>) => void, globalMatch?: (value: string) => boolean) {
        this.setState = setState;
        this.globalMatch = globalMatch;
        this._handlers = new Map();
    }

    add(name: string, handler: ISuggestionHandler) {
        this._handlers.set(name, handler);
    }

    test(value: string) :boolean {
        if (this.globalMatch && !this.globalMatch(value)) return false;
        for (const [, handler] of this._handlers) {
            const res = handler.match(value);
            if (!res) continue;
            this.lastMatchedValue = res;
            this.setState(handler.getSuggestions(res));
            return true;
        }
        return false;
    }

}

export interface ISuggestionHandler {
    match: (str: string) => any|null,
    getSuggestions: (matchRes: any) => Array<ISuggestion>
}