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
const { sendNotificationToUser } = require("./controllers/socketController");

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

// SOCKET.IO EVENT LISTENERS LIMIT
// Change to 80 or 150 whatever and see what happens
// THIS CHANGES THE DEFAULT LIMIT GLOBALLY
require("events").EventEmitter.prototype._maxListeners = 100;
// require("events").EventEmitter.defaultMaxListeners = Infinity;

//Settings
// socket.io connections
io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  // Listen when someone emits an event "join_room" to join a room passing their user_id
  socket.on("join_room", () => {
    socket.join("public");
    // SEND NOTIFICATION EVENT
    socket.on(
      "send_notification_to_user",
      (title, body, route, from_name, from_profile_pic, type, cb) => {
        sendNotificationToUser(
          socket,

          title,
          body,
          route,
          from_name,
          from_profile_pic,
          type,
          cb
        );
      }
    );
  });

  // Socket disconnected
  socket.on("disconnect", () => {
    // Closing the frontend (Closing browser/ Closing the tab)
    // console.log("User disconnected", socket.id);
  });
});

// Switched form app.listen -> server.listen (to be able to use socket.io)
server.listen({ port: process.env.APP_PORT }, async () => {
  console.log("Bloxat server up and running :)");
  await sequelize.authenticate();
  console.log("DATABASE CONNECTED!");
});
