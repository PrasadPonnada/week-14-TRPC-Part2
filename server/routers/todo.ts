import { isLoggedIn } from '../middleware/user';
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const todoRouter = router({
    todoCreate: publicProcedure
        .use(isLoggedIn)
        .input(z.object({
            title: z.string(),
            description: z.string(),
            done: z.boolean()
        }))
        .output(z.object({
            id: z.number()
        }))
        .mutation(async (opts) => {
            let title = opts.input.title;
            let description = opts.input.description;
            let isDone = opts.input.done;
            let response = await opts.ctx.db.Todo.create({
                data: {
                    title: title,
                    description: description,
                    isDone: isDone,
                    user: {
                        connect: {
                            id: opts.ctx.userId
                        }
                    }
                }
            })

            return {
                id: response.id
            }
        }),
    todoGet: publicProcedure
        .use(isLoggedIn)
        .output(z.array(z.object({
            id: z.number(),
            title: z.string(),
            description: z.string().nullable(),
            isDone: z.boolean()
        })))
        .query(async (opts) => {
            let response = await opts.ctx.db.Todo.findMany({
                where: {
                    userId: opts.ctx.userId
                },
                select: {
                    id: true,
                    title: true,
                    isDone: true,
                    description: true
                }
            })
            return response;
        })
})