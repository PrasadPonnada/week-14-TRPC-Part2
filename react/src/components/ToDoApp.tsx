import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import SignUp from "./SignUp";
import { it } from "node:test";

const TodoApp = () => {

    const userQuery = trpc.user.me.useQuery();
    const todoCreator = trpc.todo.todoCreate.useMutation();
    const todoQuery = trpc.todo.todoGet.useQuery()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    if (userQuery.isLoading) {
        return <p>Loading..</p>
    }
    if (userQuery.error) {
        return <SignUp />
    }
    const createTodoHandler = () => {
        todoCreator.mutate(
            {
                description: description,
                title: title,
                done: false
            },
            {
                onSuccess: ({ id }) => {
                    console.log(id)
                    setTitle("");
                    setDescription('')
                    todoQuery.refetch()
                }
            })
    }

    return <div>
        <h1>{userQuery.data.email}</h1>
        <div>
            <label>Title</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>
            <label>Description</label>
            <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <button onClick={createTodoHandler}>SignUp</button>
        <div>
            {todoQuery.data?.map((item) => {
                return <div>
                    <p>{item.title}</p>
                    <p>{item.description}</p>
                </div>
            })}
        </div>
    </div>

}

export default TodoApp;