
# Websocket process


## All websocket events

| Event ID | Data sent                                                                                               | Friendly name      | Description                                                   | Sent by       |
|----------|---------------------------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------|---------------|
| 0        | `{ heartbeatInterval: number }`                                                                         | hello | Sent immediately when a client connects to the gateway.       | server        |
| 1        | `{}`                                                                                                    | heartbeat          | Sent to confirm the client is alive.                          | client/server |
| 2        | `{}`                                                                                                    | heartbeat_ack      | Randomly send to confirm the client is alive.                 | client/server |
| 3        | `{ authorId: string, content: string, sentAt: number }`                                                 | message_create     | Sent to all clients when a message is created.                | server        |
| 4        | `{ chatLocked?: boolean, roomLocked?: boolean, maxParticipants?: number, discordWebhookLink?: string }` | room_update        | Sent to all clients when the room they are in is updated.     | server        |
| 5        | `{ userId: string }`                                                                                    | participant_kick   | Sent to all clients when a participant gets kicked.           | server        |
| 6        | `{ userId: string, banned?: boolean, color?: boolean, admin?: boolean }`                                | participant_change | Sent to all clients when a participant has chaned a property. | server        |
| 7        | `{}`                                                                                                    | room_close         | Sent to all clients when a room gets closed.                  | server        |

## How to handle heartbeats

When a connection is made to `/gateway`, the server immediately sends the `hello` OP code, which contains how often the server is going to send heartbeats (in milliseconds). If the server/client doesn't receive a heartbeat in the specified time frame, then it disconnects. 

Sometimes, when the server wants to know if the client is alive, it will send the `heartbeat_ack` event. The client should immediately respond with a `heartbeat` event.

