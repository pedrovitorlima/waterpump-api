import { getTasks, Task } from './tasks'
import { Request, Response, NextFunction } from "express"

describe('The Water Pump task controllers', () => {

    describe('When getTask is called with tasks in the database', () => {
        it('should return the tasks', () => {
            const tasks: Task[] = [{
                id: 0,
                duration: 1.0,
                is_processed: false
            }]
            
            const req = {
                body: {}
            }

            var responseObject = {
                body: {}
            }

            const res: Partial<Response> = {
                json: jest.fn().mockImplementation((result) => {
                    responseObject = result
                }),
                status: jest.fn().mockReturnThis(),
              };
          

            const mockNext: NextFunction = jest.fn();

            getTasks(req as Request, res as Response, mockNext)

            expect(responseObject.body).toEqual(tasks)
        })
    })
})