import { promise } from "zod";
import { router } from "./trpc";
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { User, Todo } from "./db/script";
import { userRouter } from "./routers/user";
import { todoRouter } from "./routers/todo";
import cors from 'cors'

var jwt = require('jsonwebtoken');
const SECRET = "qwe1141";

const appRouter = router({
    user: userRouter,
    todo: todoRouter
})


const server = createHTTPServer({
    middleware: cors(),
    router: appRouter,
    createContext(opts) {
        let authHeader = opts.req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(" ")[1]
            console.log(token)
            return new Promise<{ db: { Todo: typeof Todo, User: typeof User }, userId?: number }>
                ((resolve) => {
                    //@ts-ignore
                    jwt.verify(token, SECRET, (err, user) => {
                        if (user) {
                            resolve({ db: { User, Todo }, userId: user.userId })
                        }
                        else {
                            resolve({ db: { User, Todo } })
                        }
                    })
                })
        }
        return {
            db: { User, Todo }
        }
    }
})

server.listen(3000)
// Export type router type signature,
// NOT the router itself.

export type AppRouter = typeof appRouter;