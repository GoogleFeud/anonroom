

export interface IFetchError {
    error: string,
    code: number
}

export interface IBody {
    [key: string]: any;
}

export async function get<T>(path: string, settings?: RequestInit, c?: boolean) : Promise<T|IFetchError> {
    const res = await fetch(path, settings);
    if (c) console.log(await res.text());
    if (!res.ok) return {error: res.statusText, code: res.status};
    return res.json();
}

export async function post<T>(path: string, body: IBody, settings: RequestInit = {}) : Promise<T|IFetchError|undefined> {
    const realSettings = Object.assign(settings, {method: "POST", body: JSON.stringify(body), headers: {}});
    realSettings.headers = Object.assign(realSettings.headers, {"Content-Type": "application/json", credentials: "include"});
    const res = await fetch(path, realSettings);
    if (!res.ok) return {error: res.statusText, code: res.status};
    if (res.status === 204) return;
    return res.json();
}

export async function del(path: string, settings: RequestInit = {}) : Promise<IFetchError|void> {
    const res = await fetch(path, Object.assign(settings, {method: "DELETE"}));
    if (!res.ok) return {error: res.statusText, code: res.status};
    return;
}