const express = require("express")
const router = express.Router()
const authmiddleware=require("../middleware/AuthMiddleware.js")
const {
  CreateTaskController,
  GetTasksController,
  DeleteTasksController,
  GetTasksControllerbyId,
  EditTaskController,
  GetTasksSummaryController,
  getProfileDetails
} = require("../controllers/TaskController.js")

router.post("/tasks", authmiddleware, CreateTaskController)
router.get("/tasks", authmiddleware, GetTasksController)
router.get("/tasks/summary", authmiddleware, GetTasksSummaryController)
router.get("/profile", authmiddleware, getProfileDetails)
router.get("/tasks/:id", authmiddleware, GetTasksControllerbyId)
router.delete("/tasks/:id", authmiddleware, DeleteTasksController)
router.put("/tasks/:id", authmiddleware, EditTaskController)

module.exports = router