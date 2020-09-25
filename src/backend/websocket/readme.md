
# Websocket process

## Data/Packet structure

All events send out **packets**, or an object with data, in other words. Here's how a packet looks:

```js
{
  e: number,
  d: {
      ...
  }
}
```

`e` is the event ID.

## All websocket events

| Event ID | Data sent                                                                                               | Friendly name      | Description                                                   | Sent by       |
|----------|---------------------------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------|---------------|
| 0        | `{ heartbeatInterval: number }`                                                                         | hello | Sent immediately when a client connects to the gateway.       | server        |
| 1        | `{}`                                                                                                    | heartbeat          | Sent to confirm the client is alive.                          | client/server |
| 2        | `{}`                                                                                                    | heartbeat_ack      | Randomly send to confirm the client is alive.                 | client/server |
| 3        | `{ authorId: string, content: string, sentAt: number }`                                                 | message_create     | Sent to all clients when a message is created.                | server        |
| 4        | `{ chatLocked?: boolean, roomLocked?: boolean, maxParticipants?: number, discordWebhookLink?: string }` | room_update        | Sent to all clients when the room they are in is updated.     | server        |
| 5        | `{ userId: string }`                                                                                    | participant_kick   | Sent to all clients when a participant gets kicked.           | server        |
| 6        | `{ userId: string, banned?: boolean, color?: boolean, admin?: boolean }`                                | participant_update | Sent to all clients when a participant has chaned a property. | server        |
| 7        | `{}`                                                                                                    | room_close         | Sent to all clients when a room gets closed.                  | server        |


## Connecting to the gateway

Connecting to the gateway happens via the `/gateway` endpoint. There are two required query parameters:

- roomId - The ID of the room
- participantId - The ID of the participant

## How to handle heartbeats

When a connection is made to `/gateway` with correct query params, the server immediately sends the `hello` OP code, which contains how often the server is going to send heartbeats (in milliseconds). If the server/client doesn't receive a heartbeat in the specified time frame, then it disconnects. 

Sometimes, when the server wants to know if the client is alive, it will send the `heartbeat_ack` event. The client should immediately respond with a `heartbeat` event.

