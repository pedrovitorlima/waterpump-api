import pool from '../database/dbconfig';
import { Request, Response, NextFunction } from "express"
import { ParsedQs } from 'qs';

export interface Task {
    id: Number,
    duration: Number,
    is_processed: Boolean
}

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {

    console.log("Connecting with the pull of connections...")
    const client = await pool.connect();

    try {
        checkParametersValid(req.query)
    } catch(e:unknown) {
        console.error(e)

        return res.status(400).json({
            error: (e as Error).message
        })
    }

    const isProcessed = req.query.is_processed

    var sql = "SELECT * FROM public.tasks"

    if (isProcessed != null) {
        sql = "SELECT * FROM public.tasks WHERE is_processed = " + isProcessed
    }

    var all
    await client.query(sql)
        .then((dbResponse) => {
            all = dbResponse.rows
        })
        .catch(e => console.error(e))
        .then(() => client.release())

    return res.status(200).json({
        body: all
    })
}  

export const updateTasks = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.query.id
    
    if (id == null) {
        res.status(401).json({
            error: ""
        })
    }

    //TODO fetch from database based on id and status
    //TODO if not found, bad request

    let task: Task = {
        id: Number(id),
        duration: 1.0,
        is_processed: true
    }

    return res.status(200).json({
        body: task
    })   
}

export default { getTasks, updateTasks }

function checkParametersValid(query: ParsedQs) {
    if (query.is_processed == null) {
        return
    }
    
    const isProcessedParamNotBoolean =
        (query.is_processed.toString() != "true" &&
        query.is_processed.toString() != "false")

    if (isProcessedParamNotBoolean) {
        throw new Error('param is_processed is invalid.');
    }
}
