const express = require("express");
const { chats } = require("./data/data.js");
require("dotenv").config();
const cors = require('cors');
const connectToDB = require("./Config/DB.js");
const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require('./Routes/chatRoutes.js')
const { notFound, errorHandler } = require("./Middlewares/errorMiddlewares.js");
const cookieParser = require("cookie-parser");
// const https = require('https');
// const fs = require('fs');


const app = express();

// const options = {
//   key: fs.readFileSync('private-key.pem'),
//   cert: fs.readFileSync('certificate.pem'),
// };

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
        if (allowedOrigins.includes(origin)) {
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

// Not Found Handler
app.use(notFound);
app.use(errorHandler);

// const port = process.env.PORT || 5000
// // app.listen(port, console.log(`Server started at port ${port}`));

// https.createServer(options, app).listen(port, () => {
//   console.log('Server is running on https://localhost:5000');
// });

module.exports = app;