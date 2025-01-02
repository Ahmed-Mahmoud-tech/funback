// server.js
const express = require("express")
const dotenv = require("dotenv")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const { Server } = require("socket.io")

const session = require("express-session")
const cors = require("cors")
const http = require("http")

// Create Express App
const app = express()
const server = http.createServer(app)

// Load environment variables
dotenv.config()
// const crypto = require('crypto');
// const jwtSecret = crypto.randomBytes(64).toString('hex');
app.use(cookieParser())

// Middleware
app.use(express.json())
// app.use(
//   cors({
//     origin: process.env.FRONT_URL, // Replace with your frontend's origin
//     credentials: true, // Allow credentials (cookies) to be sent
//   })
// )

app.use(cors())

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())

require("./config/passport")

const sequelize = require("./db") // Database connection
require("dotenv").config()

// Middleware
app.use(express.json()) // Parse JSON requests

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend's origin
    // origin: process.env.FRONT_URL || "*", // Replace with your frontend's origin
    methods: ["GET", "POST"],
    credentials: true,
  },
})

const authRoutes = require("./routes/auth")
const usersRoutes = require("./routes/users")
const requestsRoutes = require("./routes/requests")
const sectionsRoutes = require("./routes/sections")
const gamesRoutes = require("./routes/games")
const purchasesItemsRoutes = require("./routes/purchasesItems")
const playersPurchasesRoutes = require("./routes/playersPurchases")
const sessionsRoutes = require("./routes/sessions")
const reservationsRoutes = require("./routes/reservations")
const notificationsRoutes = require("./routes/notifications")

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/requests", requestsRoutes)
app.use("/api/sections", sectionsRoutes)
app.use("/api/games", gamesRoutes)
app.use("/api/purchasesItems", purchasesItemsRoutes)
app.use("/api/playersPurchases", playersPurchasesRoutes)
app.use("/api/sessions", sessionsRoutes)
app.use("/api/reservations", reservationsRoutes)
app.use("/api/notifications", notificationsRoutes)

// Database Connection
const connectDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connected successfully!")
    // Sync models with the database
    await sequelize.sync({ alter: true })
    console.log("Database synchronized!")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1) // Exit process with error
  }
}

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`)

  // Register user for notifications
  socket.on("register", ({ userId }) => {
    console.log(`User registered: ${userId}`)
    socket.userId = userId // Store user ID with the socket
  })

  // Handle notifications
  socket.on("sendNotification", ({ toUserId, message }) => {
    console.log(`Sending notification to user: ${toUserId}`)
    for (let [id, socket] of io.of("/").sockets) {
      if (socket.userId === toUserId) {
        socket.emit("receiveNotification", { message })
        break
      }
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`)
  })
})

// Start the Server
const PORT = process.env.PORT || 5000
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  await connectDatabase() // Establish database connection when server starts
})
