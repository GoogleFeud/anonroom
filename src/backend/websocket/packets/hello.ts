
import WebSocket from "ws";

export default {
    name: "hello",
    callback: (socket: WebSocket) => {
        console.log("HELLO!");
    }
}