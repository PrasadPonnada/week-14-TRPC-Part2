import { router, publicProcedure } from "../trpc";
import { z } from 'zod'
import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "../middleware/user";
var jwt = require('jsonwebtoken');

const SECRET = "qwe1141";

export const userRouter = router({
    signup: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string(),
        }))
        .output(z.object({
            token: z.string()
        }))
        .mutation(async (opts) => {
            let username = opts.input.username;
            let password = opts.input.password;
            //Make Prisma Call / Mongoose Call
            let response = await opts.ctx.db.User.create({
                data: {
                    email: username,
                    password
                }
            })
            const token = jwt.sign({ userId: response.id }, SECRET, { expiresIn: '1h' })
            return { token }
        }),

    login: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .output(z.object({
            token: z.string()
        }))
        .mutation(async (opts) => {
            let username = opts.input.username;
            let password = opts.input.password;

            let response = await opts.ctx.db.User.findUnique({
                where: {
                    email: username,
                    password: password
                }
            })
            if (!response) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }
            const token = jwt.sign({ userId: response.id }, SECRET, { expiresIn: '1h' })
            return { token };
        }),
    me: publicProcedure
        .use(isLoggedIn)
        .output(z.object({
            email: z.string()
        }))
        .query(async (opts) => {
            let response = await opts.ctx.db.User.findUnique({
                where: {
                    id: opts.ctx.userId
                }
            })
            if (!response) {
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }
            return {
                email: response.email
            }
        })
})