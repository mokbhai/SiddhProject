const express = require("express");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const app = express();

const port = 5001;

app.get("/", (req, res) => {
    const randomIntegers = [];

    for (let index = 0; index < 10; index++) {
        randomIntegers.push(getRandomInt(1000));
    }

    res.json({ randomIntegers });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
