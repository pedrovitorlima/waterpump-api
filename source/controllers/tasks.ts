import axios, { Axios, AxiosResponse } from "axios"
import { Request, Response, NextFunction } from "express"

export interface Task {
    id: Number,
    duration: Number,
    is_processed: Boolean
}

export const getTasks = (req: Request, res: Response, next: NextFunction) => {
    //TODO get from the database

    let tasks: Task[] = [{
        id: 0,
        duration: 1.0,
        is_processed: false
    }]

    return res.status(200).json({
        body: tasks
    })

}

const updateTasks = (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    
    //TODO fetch from database based on id and status
    //TODO if not found, bad request

    let task: Task = {
        id: +id,
        duration: 1.0,
        is_processed: true
    }

    return res.status(200).json({
        body: task
    })   
}

export default { getTasks, updateTasks }