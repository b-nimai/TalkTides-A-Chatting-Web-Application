# TalkTides - A Chatting Web Application 🌊💬

**TalkTides** is a real-time chatting web application that enables users to communicate instantly. It features OTP-based signup/login, secure messaging, group chat support, and a sleek UI built with React and Vite.

## 🛠 Tech Stack

### Frontend
- **React.js** with **Vite**
- **ChakraUI** for styling & UI components
- **Axios** for HTTP requests
- **Lottie** animations

### Backend
- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Nodemailer** for sending OTP and welcome emails
- **Socket.io** for real-time messaging

### Deployment
- **Frontend** in **Vercel**
- **Backend** in **Render**

---

## ✨ Features

- ✅ OTP-based Signup & Login
- ✅ Real-time Chat (1-to-1 and Group)
- ✅ User Authentication with JWT
- ✅ Email Notifications (OTP, Welcome Mail)
- ✅ Chat History
- ✅ Online Status and Notifications
- ✅ Error Handling and Auth Middleware

---

## 📁 Project Structure
```
TalkTides-A-Chatting-Web-Application-main/
├── Backend/
│ ├── Config/ # DB configuration
│ ├── Controllers/ # Logic for users, chat, messages
│ ├── Mail/ # Email templates and sender
│ ├── Middlewares/ # Error and Auth handlers
│ ├── Routes/ # Express API routes
│ ├── Schema/ # MongoDB Schemas
│ └── Server.js # Entry point for backend
├── Frontend/
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── Pages/ # Chat and Signup pages
│ │ ├── assets/ # Images and icons
│ │ ├── animations/ # Lottie files
| | └── components / # Various components
| ├── App.jsx # Application Setup
│ └── main.jsx # App entry point
├── .env # Envrionments file
├── package.json
└── README.md
```
---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- MongoDB instance
- Vercel account (for deployment)


### Environment Variables
- Create a `.env` file with:
```
PORT = 5000
Talk_Tide_Chat_DB_URL = your_mongodb_connection_string
JWT_SECRET = your_secret_key

MAIL_HOST = smtp.gmail.com # Don't Change This
MAIL_USER = your_email@example.com
MAIL_PASS = your_email_password
```

### Backend Setup
```bash
cd Backend
npm install
npm run dev
```
### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
### 🌍 Live Demo

[Try TalkTides Live](https://talktide-nill.vercel.app)



###🤝 Contributing
- Contributions, suggestions, and improvements are welcome! Feel free to fork the repository and submit a pull request.

###📧 Contact
- Built with ❤️ by [Nimai Barman] – [nimaibarman4978@gmail.com](mailto:nimaibarman4978@gmail.com)