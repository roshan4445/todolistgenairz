const Task = require("../models/taskModel")
const mongoose = require("mongoose")
const userModel = require("../models/userModel")

module.exports.CreateTaskController = async (req, res) => {
    try {
        const { title, description, dueDate, status, priority, notes } = req.body
        if (!title || !description || !dueDate) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
      const newTask = await Task.create({
            title,
            description,
            dueDate,
            status: status || "Todo",
            priority: priority || "Medium",
            notes,
            user: req.user.id
        })
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}
module.exports.GetTasksController = async (req, res) => {

    try {
        const queryParams = req.query
        const query = {
            user: req.user.id
        }
        if (queryParams.status) {
            if (Array.isArray(queryParams.status)) {
                query.status = {
                    $in: queryParams.status
                }
            }
            else {
                query.status = queryParams.status
            }
        }
        if (queryParams.priority) {
            query.priority = queryParams.priority
        }
        const tasks = await Task.find(query)
        return res.status(200).json({
            success: true,
            query,
            tasks
        })
    } catch (error) {

        return res.status(500).json({
            error: error.message
        })

    }

}
module.exports.DeleteTasksController = async (req, res) => {
  try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            })
        }
        const task = await Task.findById(id)
        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            })
        }
        if (task.user.toString() !== req.user.id) {

            return res.status(403).json({
                message: "Unauthorized to delete this task"
            })

        }
        await Task.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"

        })
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting task",
            error: error.message

        })

    }

}

module.exports.GetTasksControllerbyId= async (req,res)=>{
    try{
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            })
        }
        const task = await Task.findById(id)
        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            })
        }
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized to view this task"
            })
        }
        return res.status(200).json({
            task:task
        })

    }
    catch(e){
        return res.status(500).json({
            message: "Error getting task",
            error: e.message

        })
    }
}


module.exports.EditTaskController= async (req,res)=>{
    try{
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            })
        }
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized to edit this task"
            })
        }
        const updatedTask=await  Task.findByIdAndUpdate(id,req.body,{ new: true })

        return res.status(200).json({
            task:updatedTask
        })

    }
    catch(e){
        return res.status(500).json({
            message: "Error updating task",
            error: e.message

        })
    }

}

module.exports.GetTasksSummaryController = async (req, res) => {
    try {
        const userId = req.user.id;

        const total = await Task.countDocuments({ user: userId });

        const completed = await Task.countDocuments({
            user: userId,
            status: "Completed"
        });

        const pending = await Task.countDocuments({
            user: userId,
            status: { $ne: "Completed" }
        });

        const overdue = await Task.countDocuments({
            user: userId,
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" }
        });

        return res.status(200).json({
            success: true,
            total,
            completed,
            pending,
            overdue
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching task summary",
            error: error.message
        });
    }
};

module.exports.getProfileDetails=async (req,res)=>{
    try{
        const user = await userModel.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            user:user
        })

    }
    catch(e){
        return res.status(500).json({
            message: "Error getting user profile",
            error: e.message

        })
    }
}