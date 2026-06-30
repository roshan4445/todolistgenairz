const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const app = express()
const db = require("./utils/db")
const AuthRouter = require("./Routes/Authrouter")
const port = process.env.PORT
const TaskRouter = require("./Routes/Taskrouter")
const connect = async () => {
    await db();
    console.log("db connected successfully")
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    })
}

connect()
app.use(cors())
app.use(express.json())
app.use(AuthRouter)
app.use(TaskRouter)