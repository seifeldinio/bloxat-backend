require("dotenv").config();
const express = require("express");
const { sequelize } = require("../models");
//AUTH
const passport = require("passport");

//CORS
const cors = require("cors");

// Socket.io
const { Server } = require("socket.io");

require("./auth/passport");

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();
const helmet = require("helmet");
const http = require("http");
var compression = require("compression");
// Importing socket.io event handlers from socketController
// const {
//   updateProjectProgress,
//   sendNotificationToUser,
//   approveTaskRequest,
//   updateTaskProgress,
//   approveBugFixRequest,
//   updateBugProgress,
//   updatePaymentMethod,
//   updateCountry,
//   sendExpectedFeedbackToUser,
//   addAppReleaseToUser,
//   updateBugScreenshots,
//   addCustomTask,
// } = require("./controllers/socketController");

// Creating a server to use socket.io
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

//Middleware
app.use(cors());
app.options("*", cors());

// To compress the response
app.use(compression());

// For security purposes
app.use(helmet());

app.use(express.json());

app.use(passport.initialize());

//ROUTE
app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// const updateProjectProgress = require("./socket/projectProgressHandler");

//Settings
// socket.io connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Socket disconnected
  socket.on("disconnect", () => {
    // Closing the frontend (Closing browser/ Closing the tab)
    console.log("User disconnected", socket.id);
  });
});

// Switched form app.listen -> server.listen (to be able to use socket.io)
server.listen({ port: process.env.APP_PORT }, async () => {
  console.log("Bloxat server up and running :)");
  await sequelize.authenticate();
  console.log("DATABASE CONNECTED!");
});
