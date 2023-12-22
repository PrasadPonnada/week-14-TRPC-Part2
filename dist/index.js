"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trpc_1 = require("./trpc");
const standalone_1 = require("@trpc/server/adapters/standalone");
const script_1 = require("./db/script");
const user_1 = require("./routers/user");
const todo_1 = require("./routers/todo");
const cors_1 = __importDefault(require("cors"));
var jwt = require('jsonwebtoken');
const SECRET = "qwe1141";
const appRouter = (0, trpc_1.router)({
    user: user_1.userRouter,
    todo: todo_1.todoRouter
});
const server = (0, standalone_1.createHTTPServer)({
    middleware: (0, cors_1.default)(),
    router: appRouter,
    createContext(opts) {
        let authHeader = opts.req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            console.log(token);
            return new Promise((resolve) => {
                //@ts-ignore
                jwt.verify(token, SECRET, (err, user) => {
                    if (user) {
                        resolve({ db: { User: script_1.User, Todo: script_1.Todo }, userId: user.userId });
                    }
                    else {
                        resolve({ db: { User: script_1.User, Todo: script_1.Todo } });
                    }
                });
            });
        }
        return {
            db: { User: script_1.User, Todo: script_1.Todo }
        };
    }
});
server.listen(3000);
