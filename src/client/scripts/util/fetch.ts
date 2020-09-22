

export interface IFetchError {
    error: string,
    code: number
}

export interface IBody {
    [key: string]: any;
}

export async function get<T>(path: string, settings?: RequestInit) : Promise<T|IFetchError> {
    const res = await fetch(path, settings);
    if (!res.ok) return {error: res.statusText, code: res.status};
    return res.json();
}

export async function post<T>(path: string, body: IBody, settings: RequestInit = {}) : Promise<T|IFetchError> {
    let realSettings = Object.assign(settings, {method: "POST", body: JSON.stringify(body), headers: {}});
    realSettings.headers = Object.assign(realSettings.headers, {"Content-Type": "application/json"});
    const res = await fetch(path, realSettings);
    if (!res.ok) return {error: res.statusText, code: res.status};
    return res.json();
}