const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let subscribers = [];

// Register subscriber
app.post('/subscribe', (req, res) => {
    const { id, url } = req.body;

    subscribers.push({ id, url });
    res.json({ message: "Subscriber registered", subscribers });
});

// Publish event
app.post('/publish', async (req, res) => {
    const { message, mode, targetIds } = req.body;

    let targets;

    if (mode === "unicast") {
        targets = subscribers.slice(0, 1);        // first subscriber
    }
    else if (mode === "multicast") {
        targets = subscribers.filter(s => targetIds.includes(s.id));
    }
    else { // broadcast
        targets = subscribers;
    }

    // Send callbacks
    for (let sub of targets) {
        try {
            await axios.post(sub.url, { message });
            console.log(`Delivered to ${sub.id}`);
        } catch (e) {
            console.log(`Failed delivering to ${sub.id}`);
        }
    }

    res.json({
        status: "Publish complete",
        notifiedSubscribers: targets.map(s => s.id)
    });
});

app.listen(4000, () => console.log("Publisher running on port 4000"));
