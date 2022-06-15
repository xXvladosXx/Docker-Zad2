const express = require("express");
const redis = require("redis");
const app = express();
const port = 3001;

const redisClient = redis.createClient({
    socket: {
        port: 6379,
        host: "redis"
    }
});

function fibonacci( num){
    let x =1,
    y= 0,
    temp;

    while(num>= 0)
    {
        temp = x;
        x = x+ y;
        y = temp;
        num--;
    }

    return y;
}

app.get("/api/gs_calc", async (req, res) => {
    if (req.query.count == null) {
        res.sendStatus(400);
        return;
    }
    const count = req.query.count;
    await redisClient.connect();
    let value = await redisClient.get(count + "");
    if (value == null) {
        value = fibonacci(count);
        redisClient.set(count + "", value + "");
    }
    redisClient.quit();
    res.status(200).send({ result: value });
});

app.listen(port, () => {
    console.log(`GS Calc listening on ${port}`);
});