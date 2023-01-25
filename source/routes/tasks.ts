import express from 'express';
import controller from '../controllers/tasks'

const router = express.Router()

router.get('/tasks', controller.getTasks)
router.put('/tasks:id', controller.updateTasks)

export = router