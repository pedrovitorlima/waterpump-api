import { getTasks, updateTasks, Task } from './tasks'
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

    const emptyRequest = {  body: {}, query: {} } as Request


    const queryShouldFail = () => {
        (pool as any).query.mockRejectedValue();
    }

    describe('The GET /tasks endpoint', () => {

        describe('When getTask is called with no params specified', () => {
            test('then it should return the tasks', async () => {
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

            describe('when the database connection fails', () => {
                test('than it should log the error', async () => {
                    queryShouldFail()
                    console.log = jest.fn();
        
                    await getTasks(emptyRequest, new ResponseMock().mockResponse(), jest.fn())
        
                    expect(console.log).toHaveBeenCalled();
                })
            })
        })

        describe('when getTask is called with parameters', () => {
            test ('then it should use specific a query for that', async () => {
                queryShouldReturn([])
        
                var res = new ResponseMock()
        
                const request = {
                    query: {}
                }
        
                request.query = {is_processed: false}
        
                await getTasks(request as Request, res.mockResponse(), jest.fn())
        
                expect((pool as any).query).toHaveBeenCalledWith('SELECT * FROM public.tasks WHERE is_processed = false')
            })

            describe('when is_processed is invalid', () => {
                test ('then it should fail if is_processed is not a number', async () => {
                    queryShouldReturn([])
            
                    var responseMock = new ResponseMock()
                    var res = responseMock.mockResponse()
                    const request = {
                        query: {}
                    }
            
                    request.query = {is_processed: "invalid" }
            
                    await getTasks(request as Request, res, jest.fn())
            
                    expect(responseMock.statusCode).toEqual(400)
                    expect(responseMock.responseObject).toEqual({error: "param is_processed is invalid."})
                })
            })
        })
    })

    describe('The POST /task endpoint', () => {
        describe('when the request is valid', () => {
            test('then it should return a 200', async () => {
                var res = new ResponseMock()

                const request = {
                    query: {}
                }
        
                request.query = {id: 1}
                
                await updateTasks(request as Request, res.mockResponse(), jest.fn())

                expect(res.statusCode).toBe(200)
            })

            test('then it should update is_processed to true', async () => {
                var res = new ResponseMock()
                const expectedQuery = "UPDATE public.tasks SET is_processed = true WHERE id = 1"

                queryShouldReturn({})

                const request = {
                    query: {}
                }
        
                request.query = {id: 1, is_processed: true}
                
                await updateTasks(request as Request, res.mockResponse(), jest.fn())

                expect((pool as any).query).toHaveBeenCalledWith(expectedQuery)
            })
        })
    })
})

class ResponseMock {
    declare responseObject: { body: {} }
    declare statusCode: 0

    mockResponse(): Response  {
        const res: Partial<Response> = {
            json: jest.fn().mockImplementation((result) => {
                this.responseObject = result
            })
        };

        res.status = jest.fn().mockImplementation((status) => {
            this.statusCode = status
            return res
        })

        return res as Response
    }
}