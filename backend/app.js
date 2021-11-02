require("dotenv").config();
const express = require("express");
const controller = require("./controller");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);

app
//   .use(cors())
  .use(express.json())
  //   .use(cookieParser())
  //   .post("/login", controller.login)
  //   .post("/register", controller.register)
  .get("/auth", controller.auth)
  .use(controller.error404)
  .use(controller.error500);
server.listen(process.env.port, () => {
  console.log(`Server started on ${process.env.port}`);
});
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const ioHandler = require("./io");
ioHandler(io);
