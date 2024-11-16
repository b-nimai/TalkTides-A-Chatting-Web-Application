const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.Talk_Tide_Chat_DB_URL, {});
        console.log(`MongoDB Connected: ${connect.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectToDB;