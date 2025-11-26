const express = require('express');
const app = express();
app.use(express.json());

app.post('/callback', (req, res) => {
    console.log("Received event:", req.body.message);
    res.json({ status: "Event received" });
});

app.listen(5001, () => console.log("Subscriber listening on 5001"));
