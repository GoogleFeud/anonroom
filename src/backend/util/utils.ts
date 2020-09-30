
import Express from "express";

import fs from "fs";
import WebSocket from "ws";
import http from "http";
import { IObject } from "./interfaces";
import {Room} from "../database/models/Room";
import fetch from "node-fetch";

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

export function sendToSocket(socket: WebSocket, event: string|number, data: any) {
    return socket.send(JSON.stringify({e: event, d: data}));
}

export function parseCookies(req: http.IncomingMessage) : IObject {
    const cookies: IObject = {};
    if (!req.headers.cookie) return cookies;
    const rawCookies = req.headers.cookie.split(";");
    for (let cookie of rawCookies) {
        const [name, val]: Array<string> = cookie.split("=");
        cookies[name.trim()] = decodeURI(val.trim());
    }
    return cookies;
}

export async function sendToDiscordWebhook(room: Room, authorName: string, sentAt: number, content: string, authorColor?: string) : Promise<void> {
    if (!room.discordWebhook) return;
    const res = await fetch(room.discordWebhook, {
        method: "POST",
        body: JSON.stringify({username: authorName, embeds: [
            {
                author: {name: authorName},
                color: parseInt(authorColor?.replace("#", "0x") || "", 16),
                description: content,
                timestamp: new Date(sentAt).toISOString()
            }
        ]}),
        headers: {"Content-Type": "application/json"}
    });
    if (!res.ok) room.update({discordWebhook: null});
}
