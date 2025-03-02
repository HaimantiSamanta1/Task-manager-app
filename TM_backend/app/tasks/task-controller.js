const moment = require('moment');
const taskService = require('../services/task-service');
const userService = require('../services/use-service')
//Create task START
exports.createTask = async (req, res) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided.',
            });
        }
        const user = await userService.finduserAccountdetails(accessToken);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found.',
                local: accessToken
            });
        }
        let { title, description, category, task_assign_date } = req.body;
        const capitalizeFirstLetter = (str) => {
            return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
        };
        title = capitalizeFirstLetter(title);
        description = capitalizeFirstLetter(description);
        const data = {
            title,
            description,
            category,
            task_assign_date: task_assign_date ? new Date(task_assign_date) : null,
            usermasters:user._id
        };
        const task = await taskService.createTask(data);
        return res.status(200).json({Status: true,message: 'Successfully added a new task!',task});
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
//Create task END

//Get task START
exports.getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTaskDetails();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
//Get task END

//Get task of a user START
exports.getTaskByUser = async (req, res) => {
    try {
        //let { token } = req.userData;
        const accessToken = req.headers['authorization']?.split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided.',
            });
        }

        const data = await userService.finduserAccountdetails(accessToken);

        if (!data) {
            return res.status(401).json({
                success: false,
                message: 'User not found.',
                local: accessToken
            });
        }
        console.log("user",data)
        console.log("user id",data._id)
        console.log("user name",data.name)

        return res.status(200).json({Status: true,message: 'Successfully added a new task!',data});
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
//Get task of a user END

//Update task START
exports.updateTask = async (req, res) => {
    try {
        let { task_id } = req.params;
        const { title, description, status, task_assign_date } = req.body;

        let data = {};    

        const data1 = {
            title: title || undefined,
            description: description || undefined,
            status: status || undefined,
            task_assign_date: task_assign_date && moment(task_assign_date, 'YYYY-MM-DD', true).isValid() 
                ? new Date(task_assign_date) 
                : undefined
        };

        // Assign only valid values to `data`
        data = Object.fromEntries(
            Object.entries(data1).filter(([_, v]) => v !== undefined)
        );

        if (task_assign_date && !moment(task_assign_date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ Status: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const result = await taskService.updateTask(task_id, data);

        if (result.Status === true) {
            let updateData = result.result;
            return res.status(200).json({ Status: true, message: 'Task updated successfully!', updateData });
        } else {
            return res.status(200).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ Status: false, message: err.message });
    }
};
//Update task END

//Delete task START
exports.deleteTask = async (req, res) => {
    try {
        //let { token } = req.userData;
        let { task_id } = req.params;
        let data = await taskService.findAndDeleteTask(task_id);
        if (data) {
            return res.status(200).json({ Status: true, message: 'Task deleted successfully!'});
        } else {
            return res.status(404).send({ Status: false, message: 'Task Not Found!' });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({Status: false,message: err.message});
    }
};
//Delete task END

