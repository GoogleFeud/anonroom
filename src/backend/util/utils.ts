
import Express from "express";

import fs from "fs";

export function getFilesFromDir(dir: string, folderName?: string) : Array<string> {
    const things = fs.readdirSync(dir);
    const files = [];
    for (let thing of things) {
        thing = `/${thing}`;
        const stats = fs.statSync(dir + thing);
        if (stats.isDirectory()) files.push(...getFilesFromDir(dir + thing, (folderName) ? folderName + thing:thing));
        else files.push((folderName) ? folderName + thing:thing)
    }
    return files;
}

export function generateRoomID(length: number = 12) : string {
    return '_' + Math.random().toString(36).substr(2, length);
}

export function sendStatus(res: Express.Response, statusMsg: string, statusCode: number) {
    res.statusMessage = statusMsg;
    return res.sendStatus(statusCode);
}

export function getIP(req: Express.Request) : string {
    const forwarded = req.headers['x-forwarded-for'];
    let ip = req.headers["x-real-ip"];
    if (!ip && forwarded) {
        if (Array.isArray(forwarded) && forwarded[0] != undefined) ip = forwarded[0];
        else ip = forwarded.toString();
    } else ip = req.connection.remoteAddress;
    return ip as string;
}