# Project README

## Overview

This project demonstrates a simple **Publish–Subscribe (Pub/Sub)** system built using **Node.js, Express, and Axios**.

- The **Publisher** maintains a list of subscribers and delivers events to them.
- The **Subscribers** expose a `/callback` endpoint where they receive messages.
- Supports **unicast**, **multicast**, and **broadcast** delivery.

## Architecture

![Architecture Diagram](Architecture Diagram.jpg)

(Replace the above image with the actual exported architecture diagram once you have it.)

## File Structure

```
publisher.js       → Handles subscriber registration & event publishing
subscriber.js      → Subscriber 1 (listens on port 5001)
subscriber2.js     → Subscriber 2 (listens on port 5002)
```

## Prerequisites

- Node.js installed

## Installation

Install dependencies (Express & Axios):

```bash
npm install express axios
```

## Running the Project

### 1. Start Subscribers

Subscriber 1:

```bash
node subscriber.js
```

Subscriber 2:

```bash
node subscriber2.js
```

### 2. Start Publisher

```bash
node publisher.js
```

### 3. Register Subscribers

Use Postman / curl:

Register Subscriber 1:

```bash
POST http://localhost:4000/subscribe
Body:
{
  "id": "sub1",
  "url": "http://localhost:5001/callback"
}
```

Register Subscriber 2:

```bash
POST http://localhost:4000/subscribe
Body:
{
  "id": "sub2",
  "url": "http://localhost:5002/callback"
}
```

### 4. Publish Messages

#### Broadcast

```bash
POST http://localhost:4000/publish
{
  "message": "Hello everyone!",
  "mode": "broadcast"
}
```

#### Unicast (first subscriber only)

```bash
POST http://localhost:4000/publish
{
  "message": "Hello sub1",
  "mode": "unicast"
}
```

#### Multicast (specific subscribers)

```bash
POST http://localhost:4000/publish
{
  "message": "Hello selected subs",
  "mode": "multicast",
  "targetIds": ["sub1", "sub2"]
}
```

## How It Works

The workflow of this Publish–Subscribe system is simple and follows these steps:

### 1. **Subscribers Start and Expose a Callback Endpoint**

Each subscriber runs its own Express server and exposes a `/callback` endpoint:

- `subscriber.js` listens on **port 5001**
- `subscriber2.js` listens on **port 5002**

Whenever a message is delivered, the subscriber prints:

```
Received event: <message>
```

This means subscribers are always ready to receive events.

### 2. **Subscribers Register With the Publisher**

Before receiving messages, each subscriber must register itself using:

```
POST /subscribe
{
  "id": "sub1",
  "url": "http://localhost:5001/callback"
}
```

The publisher stores all subscribers in an in‑memory `subscribers[]` array.

### 3. **Publisher Accepts Publish Requests**

When a client sends a message to:

```
POST /publish
```

The body decides the delivery mode:

- **broadcast** → send to _all_ subscribers
- **unicast** → send to _first_ subscriber only
- **multicast** → send to _specific_ subscribers based on `targetIds`

### 4. **Publisher Delivers Events**

The publisher loops through the selected subscribers and sends:

```
POST <subscriber.url>
{
  "message": "..."
}
```

It uses **Axios** to deliver the message asynchronously.

The console logs show which subscribers received the message.

### 5. **Subscribers Confirm Receipt**

Each subscriber responds with:

```
{ status: "Event received" }
```

This completes the Pub/Sub cycle.

---

This system simulates a real-world event-driven architecture where publishers don’t need to know subscriber details beyond their callback URLs, making the system loosely coupled and scalable.
