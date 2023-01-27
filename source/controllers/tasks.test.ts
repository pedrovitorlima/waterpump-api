import { getTasks, Task } from './tasks'
import { Request, Response } from "express"
import pool from '../database/dbconfig';

describe('The Water Pump task controllers', () => {

    beforeEach(() => {
        (pool as any).connect = jest.fn().mockReturnThis();
        (pool as any).query = jest.fn().mockReturnThis();
        (pool as any).release = jest.fn().mockReturnThis();
    })

    const queryShouldReturn = (returnFromDb: any) => {
        (pool as any).query.mockResolvedValueOnce({
            rows: returnFromDb,
        });
    }

    const emptyRequest = {  body: {} } as Request

    const queryShouldFail = () => {
        (pool as any).query.mockRejectedValue();
    }

    describe('When getTask is called with tasks in the database with no parameters', () => {

        it('should return the tasks', async () => {
            const tasks = [{
                id: 0,
                duration: 1.0,
                is_processed: false
            }] as Task[]

            queryShouldReturn(tasks)

            var res = new ResponseMock()
            
            await getTasks(emptyRequest, res.mockResponse(), jest.fn())

            expect(res.responseObject.body).toEqual(tasks)
            expect((pool as any).release).toHaveBeenCalled()
        })
    })

    describe('When getTask is called with tasks in the database and parameter pending filled', () => {

        it ('should use specific query', async () => {
            queryShouldReturn([])

            var res = new ResponseMock()

            const request = {
                query: {}
            }

            request.query = {is_pending: false}

            await getTasks(request as Request, res.mockResponse(), jest.fn())

            expect((pool as any).query).toHaveBeenCalledWith('SELECT * FROM public.tasks WHERE is_pending = false')
         })

    })

    describe('When an error happen while connecting to the database', () => {
        it ('should log the error', async () => {
            queryShouldFail()
            console.log = jest.fn();

            await getTasks(emptyRequest, new ResponseMock().mockResponse(), jest.fn())

            expect(console.log).toHaveBeenCalled();
        })
    })
})

class ResponseMock {
    declare responseObject: { body: {} }

    mockResponse(): Response  {
        const res: Partial<Response> = {
            json: jest.fn().mockImplementation((result) => {
                this.responseObject = result
            }),
            status: jest.fn().mockReturnThis(),
        };

        return res as Response
    }
}