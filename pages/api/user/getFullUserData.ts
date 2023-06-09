/* 
Query like this: 
URL: /api/login
AUTH Basic: username: email, password: password 
*/

import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../client"
import { User } from "@/types/user"
import { ToDo } from "@/types/toDo"
import { Calendar } from "@/types/calendar"
import { Task } from "@/types/task"
import { Category } from "@/types/category"

type UserData = {
  user: User
  toDo: ToDo
  calendar: Calendar
}

type Data = {
  result: {
    success: boolean
    error?: string
    body?: UserData
  }
}

async function main(
  userId: string | undefined,
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return {
      success: false,
      error: "No user found",
    }
  }
  if (!(user?.password === password && user?.email === email)) {
    return {
      success: false,
      error: "NOT AUTHERIZED",
    }
  }

  const categories = await prisma.category.findMany({
    where: { userId: userId },
    include: { tasks: true },
  })

  const toDoCategories: Category[] = categories.map(
    (category: {
      id: string
      title: string
      color: string | null | undefined
      tasks: Task[]
    }) => ({
      id: category.id as string,
      title: category.title as string,
      color: category.color as string | undefined | null,
      toDoList: category.tasks.map((task: Task) => ({
        id: task.id as string,
        categoryId: task.categoryId as string,
        title: task.title as string,
        description: task.description as string | null,
        date: task.date.toISOString().slice(0, 10) as string,
        done: task.done as boolean,
      })) as Task[],
    })
  )

  const calendarActivities = await prisma.calendar.findMany({
    where: { userId: userId },
  })

  calendarActivities

  const activites = calendarActivities.map((item) => ({
    id: item.id,
    calendarId: "calendar1",
    date: item.date,
    startTime: item.startTime,
    endTime: item.endTime,
    name: item.name,
    ...(item.description && { description: item.description }),
  }))

  const calendar = {
    id: "calendar1",
    userId: user.id,
    activites: activites,
  }

  const data = {
    user: {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
    } as User,
    toDo: { category: toDoCategories } as ToDo,
    calendar: calendar,
  }
  return { success: true, body: data }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({
      result: { success: false, error: "Missing Authorization header" },
    })
  }

  const authType = authHeader.split(" ")[0]
  const authValue = authHeader.split(" ")[1]

  if (authType !== "Basic") {
    return res
      .status(401)
      .json({ result: { success: false, error: "Invalid Authorization type" } })
  }

  const [email, password] = Buffer.from(authValue, "base64")
    .toString()
    .split(":")

  const { id } = req.query

  const result = await main(id as string, email, password)
  if (result) {
    if (result.success) {
      res.status(200).json({ result: JSON.parse(JSON.stringify(result)) })
    } else {
      res.status(400).json({ result: JSON.parse(JSON.stringify(result)) })
    }
  } else {
    res.status(500).json({
      result: {
        success: false,
        error: "Server failure",
      },
    })
  }
}
