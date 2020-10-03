

export function calculateStringDifference(str1: string, str2: string) : number {
    /** Levenstein algorithm */
    const matrix: Array<Array<number>> = Array.from({length: str2.length + 1}, () => Array.from({length: str1.length + 1}));
    for (let i=0; i <= str1.length; i++) {
        matrix[0][i] = i;
    }
    for (let i=0; i <= str2.length; i++) {
        matrix[i][0] = i;
    }
    for (let j=1; j <= str2.length; j++) {
        for (let i=1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0:1;
            matrix[j][i] = Math.min(matrix[j][i-1] + 1, matrix[j-1][i] + 1, matrix[j-1][i-1] + indicator);
        }
    }
    return matrix[str2.length][str1.length];
}

export const ALL_THEMES: Record<string, string> = {
    "discord": "/css/themes/discord.css",
    "default": "/css/themes/discord.css",
    "modern": "/css/themes/modern.css"
};

export let _LAST_IMPORTED_CSS_FILE: HTMLLinkElement;

export function importCSS(path: string) : void {
    path = ALL_THEMES[path];
    if (_LAST_IMPORTED_CSS_FILE)  _LAST_IMPORTED_CSS_FILE.href = path;
    else {
        _LAST_IMPORTED_CSS_FILE = document.createElement("link");
        _LAST_IMPORTED_CSS_FILE.href = path;
        _LAST_IMPORTED_CSS_FILE.type = "text/css";
        _LAST_IMPORTED_CSS_FILE.rel = "stylesheet";
        _LAST_IMPORTED_CSS_FILE.media = "screen,print";
        document.getElementsByTagName("head")[0].appendChild(_LAST_IMPORTED_CSS_FILE);
    }
}