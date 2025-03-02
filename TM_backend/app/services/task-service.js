const task = require('../tasks/task-model');
const user = require('../users/user-model');
const tokenService = require('../services/jwt-service');

class taskServie {

    // Create task SRART
      async createTask(data) {
        try {
            var result = await task.create(data);
            if (result && result.usermasters) {
                await user.findByIdAndUpdate(result.usermasters, { $push: { tasks: result._id } }, { new: true });
                result = await task.findById(result._id)
                        .populate({
                            path: 'usermasters',
                            model: 'usermaster',
                            select:'-createdAt -updatedAt -tokens -tasks -password -__v'
                        })

    
                    return { Status: true, data: result };
                } else {
                    return { Status: false, message: 'User ID missing in task data' };
                }

        } catch (err) {
          console.log('create service ', err);
          throw err
        }
      }
    //Create task END

    //Read all task information START
      async getTaskDetails() {
        try {
          const result = await task.find().sort({ createdAt: -1 })
          return { Status: true, data: result }
        } catch (err) {
          console.log('Get task service err', err);
          throw new Error()
        }
      }
    //Read all task information END

    //Update task SRART
    async updateTask(id,data) {
        try {
            let result = await task.findByIdAndUpdate(id,{$set:data},{new:true})
	        return {Status:true,result}
        } catch (err) {
            console.log('Update service ', err);
        throw err
        }
    }
    //Update task END


    //delete task START
    async findAndDeleteTask(id) {
        try {
        return await task.findByIdAndDelete(id, { $set: { active: false } }, { new: true })
        } catch (err) {
        throw err
        }
    }
    //delete task END
 

    async updateTask(task_id, updateData) {
      try {
          if (!task_id) {
              return { Status: false, message: 'Task ID is required.' };
          }
          const updatedTask = await task.findByIdAndUpdate(task_id,{ $set: updateData },{ new: true, runValidators: true })
                               .exec();
    
          if (!updatedTask) {
              return { Status: false, message: 'Task not found.' };
          }
    
          return { Status: true, message: 'Task updated successfully!', result: updatedTask };
      } catch (error) {
          console.error('Error updating task:', error);
          return { Status: false, message: 'Server error while updating task.' };
      }
    }





}
module.exports = new taskServie();