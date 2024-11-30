const express = require("express");
const { chats } = require("./data/data.js");
require("dotenv").config();
const cors = require('cors');
const connectToDB = require("./Config/DB.js");
const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require('./Routes/chatRoutes.js')
const messageRoutes = require('./Routes/messageRoutes.js')
const { notFound, errorHandler } = require("./Middlewares/errorMiddlewares.js");
const cookieParser = require("cookie-parser");
const { Server } = require('socket.io');


const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

app.use(express.json());
// Allow CORS
// app.use(cors());
// app.use(cors({
//   origin: 'https://talktide-nill.vercel.app/',
//   methods:'GET,POST,PUT,DELETE,OPTIONS',
//   allowedHeaders: 'Content-Type,Authorization',
//   credentials: true
// }));

const allowedOrigins = ['https://talktide-nill.vercel.app', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Other middleware and routes
app.use(express.json());

// Connect DataBase
connectToDB();

app.get("/", (req, res) => {
    res.send("App is running fine..");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Not Found Handler
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000
const server = app.listen(port, console.log(`Server started at port ${port}`));

// Initialize Socket.IO and bind it to the HTTP server
const io = new Server(server, {
    pingTimeout: 60000, // Adjust ping timeout if needed
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

io.on("connection", (socket) => {
    // console.log("Connected to Socket.io, id :", socket.id);

    socket.on("setup", (userData) => {
        socket.join(userData?._id);
        socket.emit('Connected');
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        // console.log("User joined room: ", room)
    })

    socket.on("new message", (newMessageRecived) => {
        let chat = newMessageRecived.chat;

        if(!chat.users) return console.log("chat.users not define");
        chat.users.forEach(user => {
            if(user._id == newMessageRecived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageRecived);
        })
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.off("setup", () => {
        // console.log("User Disconnected");
        socket.leave(userData._id);
    })
})

// module.exports = app;