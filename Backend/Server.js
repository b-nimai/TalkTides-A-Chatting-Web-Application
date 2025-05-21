const express = require("express");
require("dotenv").config();
const cors = require('cors');
const connectToDB = require("./Config/DB.js");
const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require('./Routes/chatRoutes.js');
const messageRoutes = require('./Routes/messageRoutes.js');
const notificationRoutes = require('./Routes/notificationRoutes.js');
const { notFound, errorHandler } = require("./Middlewares/errorMiddlewares.js");
const cookieParser = require("cookie-parser");
const { Server } = require('socket.io');
const { createServer } = require('http');
const User = require("./Schema/UserSchema.js");

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

// Connect to the database
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

// For production (Vercel) create server with Socket.IO
const server = createServer(app);

// For development
// const server = app.listen(5000);

// Initialize Socket.IO and bind it to the HTTP server
const io = new Server(server, {
    pingTimeout: 60000, // Adjust ping timeout if needed
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    // console.log("Connected to Socket.io, id:", socket.id);

    let userId = "";
    socket.on("setup", (userData) => {
        userId = userData._id;
        socket.join(userId);
        User.findByIdAndUpdate(userId, { isOnline: true }).exec();
        socket.emit('Connected');
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("new message", (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // socket.off("setup", async () => {
    //     await User.findByIdAndUpdate(userId, { isOnline: false });
    //     socket.leave(userData._id);
    // });
    socket.on("disconnect", async () => {
        if (userId) {
            await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: Date.now() });
            socket.leave(userId);
        }
      });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
