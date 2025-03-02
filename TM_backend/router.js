const router = require('express').Router();
const userRoutes = require('./app/users/user-router');
const taskRoutes = require('./app/tasks/task-router');

router.use('/user', userRoutes);
router.use('/task',taskRoutes);

module.exports = router;
