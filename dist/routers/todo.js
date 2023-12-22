"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRouter = void 0;
const user_1 = require("../middleware/user");
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
exports.todoRouter = (0, trpc_1.router)({
    todoCreate: trpc_1.publicProcedure
        .use(user_1.isLoggedIn)
        .input(zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        done: zod_1.z.boolean()
    }))
        .output(zod_1.z.object({
        id: zod_1.z.number()
    }))
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let title = opts.input.title;
        let description = opts.input.description;
        let isDone = opts.input.done;
        let response = yield opts.ctx.db.Todo.create({
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
        });
        return {
            id: response.id
        };
    })),
    todoGet: trpc_1.publicProcedure
        .use(user_1.isLoggedIn)
        .output(zod_1.z.array(zod_1.z.object({
        id: zod_1.z.number(),
        title: zod_1.z.string(),
        description: zod_1.z.string().nullable(),
        isDone: zod_1.z.boolean()
    })))
        .query((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield opts.ctx.db.Todo.findMany({
            where: {
                userId: opts.ctx.userId
            },
            select: {
                id: true,
                title: true,
                isDone: true,
                description: true
            }
        });
        return response;
    }))
});
