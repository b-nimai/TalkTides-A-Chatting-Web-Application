const express = require("express");
require("dotenv").config();
const cors = require('cors');
const connectToDB = require("./Config/DB.js");
const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require('./Routes/chatRoutes.js')
const messageRoutes = require('./Routes/messageRoutes.js')
const notificationRoutes = require('./Routes/notificationRoutes.js');
const { notFound, errorHandler } = require("./Middlewares/errorMiddlewares.js");
const cookieParser = require("cookie-parser");
const { Server } = require('socket.io');


const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

app.use(express.json());

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
app.use('/api/notification', notificationRoutes);

// Not Found Handler
app.use(notFound);
app.use(errorHandler);

// for Development
// const port = process.env.PORT || 5000
// const server = app.listen(port, console.log(`Server started at port ${port}`));

// For production
const server = createServer(app);

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

// For Production
// Export the app as a serverless function for Vercel
module.exports = (req, res) => {
    if (req.url.startsWith('/socket.io')) {
        io.httpServer.emit('request', req, res);
    } else {
        app(req, res);
    }
};