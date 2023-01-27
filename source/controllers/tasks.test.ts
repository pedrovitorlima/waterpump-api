import { getTasks, Task } from './tasks'
import { Request, Response, NextFunction } from "express"
import pool from '../database/dbconfig';

describe('The Water Pump task controllers', () => {

    describe('When getTask is called with tasks in the database', () => {

        beforeAll(() => {
            (pool as any).connect = jest.fn().mockReturnThis();
            (pool as any).query = jest.fn().mockReturnThis();
            (pool as any).release = jest.fn().mockReturnThis();
        })

        const queryShouldReturn = (returnFromDb: any) => {
            (pool as any).query.mockResolvedValueOnce({
                rows: returnFromDb,
            });
        }

        it('should return the tasks', async () => {

            const tasks = [{
                id: 0,
                duration: 1.0,
                is_processed: false
            }] as Task[]

            queryShouldReturn(tasks)
            
            var responseObject = { body: {} }

            const res: Partial<Response> = {
                json: jest.fn().mockImplementation((result) => {
                    responseObject = result
                }),
                status: jest.fn().mockReturnThis(),
              };
          
            const mockNext: NextFunction = jest.fn();

            const req = {  body: {} }
            await getTasks(req as Request, res as Response, mockNext)

            expect(responseObject.body).toEqual(tasks)
        })
    })
})

class ResponseMock {
    declare responseObject: Partial<Response>

    mockResponse(): Partial<Response>  {
        var responseObject: Partial<Response>

        const res: Partial<Response> = {
            json: jest.fn().mockImplementation((result) => {
                responseObject = result
            }),
            status: jest.fn().mockReturnThis(),
        };

        return res
    }
}