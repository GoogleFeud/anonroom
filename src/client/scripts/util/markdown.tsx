
import React from "react";
import Markdown from "simple-markdown";
import { RoomData } from "../pages/Room";

import {Mention} from "../components/Chat/Mention";

export default function getOutputter(room: RoomData): (msg: string) => any {
    const rules: IRules = {
        Array: Markdown.defaultRules.Array,
        underline: Markdown.defaultRules.u,
        italics: Markdown.defaultRules.em,
        code: Markdown.defaultRules.inlineCode,
        text: Markdown.defaultRules.text
    };

    rules.bold = {
        order: rules.underline.order - 0.5,
        match: (source: string) => /^\*\*([\s\S]+?)\*\*(?!\*)/.exec(source),
        parse: (capture: Markdown.Capture, parse: any, state: Markdown.State) => ({ content: parse(capture[1], state) }),
        react: (node: any, output: any) => <b>{output(node.content)}</b>
    };

    rules.mention = {
        order: Markdown.defaultRules.strong.order,
        match: (source: string) => /^@([^ ]+)/.exec(source),
        parse: (capture: Markdown.Capture, parse: any, state: Markdown.State) => {
            return { content: parse(capture[1], state) };
        },
        react: (node: any, output: any) => {
            return <Mention name={output(node.content)[0]} room={room}></Mention>;
        }
    };

    const parser = Markdown.parserFor(rules, { inline: true });
    const reactOutput = Markdown.outputFor(rules, "react");
    return (msg: string) => {
        return reactOutput(parser(msg));
    };
}


interface IRules {
    [key: string]: any
}