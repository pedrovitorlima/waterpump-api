import pool from '../database/dbconfig';
import { Request, Response, NextFunction } from "express"

export interface Task {
    id: Number,
    duration: Number,
    is_processed: Boolean
}

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {

    console.log("Connecting with the pull of connections...")
    const client = await pool.connect();

    const sql = "SELECT * FROM public.tasks"
    var all
    await client.query(sql).then((dbResponse) => {
        all = dbResponse.rows
    }).catch(e => console.error(e)).
    then(() => client.release())

    return res.status(200).json({
        body: all
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