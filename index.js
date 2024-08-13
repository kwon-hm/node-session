const express = require("express");
const app = express();
const cors = require('cors');
const http = require('http');
const session = require('express-session');

app.use(express.json({
	limit: "50mb"
}));
app.use(cors());
const server = http.createServer({}, app);

server.listen(5556, () => { // for http and https
	console.log(`🚀 Server is now running on ${5556}`)
});

app.use(session({
    secret: 'inf0fla!',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

const map = new Map()

app.get("/img", (req, res) => {
    console.log(req.query.img)
    const sessionId = req.sessionID
    console.log(sessionId)
    req.session.sessionId = sessionId
    map.set(sessionId, {
        img: req.query.img,
        text: "aaa",
        res: res
    })
})

app.get("/python", (req, res) => {
    const imgText = req.query.imgText
    const sessionId = req.query.sessionId
    const session = map.get(sessionId)
    if (session) {
        session.res.send(imgText);
        map.delete(sessionId); // 응답 후 Map에서 삭제
        res.send("done")
    } else {
        res.status(404).send("Session not found or response already sent");
    }
})