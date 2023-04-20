import { Task } from "@/types/task"
import { User } from "@/types/user"

export async function editTaskFetch(task: Task, user: User): Promise<Task> {
  const username = user.email
  const password = user.password
  const authHeader = `Basic ${btoa(`${username}:${password}`)}`

  console.log(task)

  const taskBody = {
    title: task.title,
    description: task.description,
    date: new Date(task.date).toISOString(),
    done: task.done,
    categoryId: task.categoryId,
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: authHeader,
  }

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(taskBody),
    credentials: "include" as RequestCredentials,
  }

  const res = await fetch(
    `http://localhost:3000/api/task/task?id=${task.id}`,
    requestOptions
  )
  const json = await res.json()
  const data = JSON.parse(JSON.stringify(json.result))

  console.log(data)

  const date = new Date(data.date as string).toISOString().slice(0, 10)

  const editedTask: Task = {
    date: date,
    id: data.id as string,
    categoryId: data.categoryId as string,
    title: data.title as string,
    description: data.description as string | null,
    done: data.done as boolean,
  }

  console.log(editedTask)

  return editedTask
}