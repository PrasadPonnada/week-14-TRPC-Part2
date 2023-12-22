"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = exports.User = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.User = prisma.user;
exports.Todo = prisma.toDo;
