const express = require('express')
const app = express();
const cors = require('cors')

const http = require('http')
const httpServer = http.createServer(app)

const { Server } = require("socket.io");
const io = new Server(httpServer, {
    cors: {
        origin: "http://192.168.1.108:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors())

PORT = process.env.PORT | 5000

io.on("connection", (socket) => {
    console.log(`Connected User ID: ${socket.id}`)

    socket.on("join_room", (room) => {
        socket.join(room)
    })
    socket.on("sent_message", (data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
})



httpServer.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))