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
exports.userRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const user_1 = require("../middleware/user");
var jwt = require('jsonwebtoken');
const SECRET = "qwe1141";
exports.userRouter = (0, trpc_1.router)({
    signup: trpc_1.publicProcedure
        .input(zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string(),
    }))
        .output(zod_1.z.object({
        token: zod_1.z.string()
    }))
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let username = opts.input.username;
        let password = opts.input.password;
        //Make Prisma Call / Mongoose Call
        let response = yield opts.ctx.db.User.create({
            data: {
                email: username,
                password
            }
        });
        const token = jwt.sign({ userId: response.id }, SECRET, { expiresIn: '1h' });
        return { token };
    })),
    login: trpc_1.publicProcedure
        .input(zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string()
    }))
        .output(zod_1.z.object({
        token: zod_1.z.string()
    }))
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let username = opts.input.username;
        let password = opts.input.password;
        let response = yield opts.ctx.db.User.findUnique({
            where: {
                email: username,
                password: password
            }
        });
        if (!response) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const token = jwt.sign({ userId: response.id }, SECRET, { expiresIn: '1h' });
        return { token };
    })),
    me: trpc_1.publicProcedure
        .use(user_1.isLoggedIn)
        .output(zod_1.z.object({
        email: zod_1.z.string()
    }))
        .query((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield opts.ctx.db.User.findUnique({
            where: {
                id: opts.ctx.userId
            }
        });
        if (!response) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
        }
        return {
            email: response.email
        };
    }))
});
