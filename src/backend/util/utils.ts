

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