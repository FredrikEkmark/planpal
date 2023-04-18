// Query like this:   and with an Auth header username: email, password: password

import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

type CategoryBody = {
  title: string
  color: string | undefined
}

type CategoryImport = {
  id: string
  title: string
  color: string
  userId: string
}

type Data = {
  result: CategoryImport | string
}

const prisma = new PrismaClient()

async function main(
  id: string | undefined,
  email: string,
  password: string,
  body: CategoryBody | undefined,
  method: string | undefined
) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  })

  if (!(user?.password === password)) {
    return "NOT AUTHORIZED"
  }

  switch (method) {
    case "GET": {
      if (id == undefined) {
        return "Id not provided"
      }
      const category = await prisma.category.findUnique({
        where: { id: id },
      })

      if (!category) {
        return "ERROR"
      }

      if (category.userId !== user.id) {
        return "NOT AUTHORIZED"
      }
      return category
    }
    case "POST": {
      if (!body) {
        return "Body not provided"
      }

      const postBody = {
        title: body.title,
        color: body.color,
        userId: user.id,
      }

      const category = await prisma.category.create(postBody)
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ result: "Missing Authorization header" })
  }

  const authType = authHeader.split(" ")[0]
  const authValue = authHeader.split(" ")[1]

  if (authType !== "Basic") {
    return res.status(401).json({ result: "Invalid Authorization type" })
  }

  const [email, password] = Buffer.from(authValue, "base64")
    .toString()
    .split(":")

  const { id } = req.query
  const { body } = req.body

  const result = await main(id as string, email, password, body, req.method)
  if (result) {
    res.status(200).json({ result: JSON.parse(JSON.stringify(result)) })
    await prisma.$disconnect()
  } else {
    res.status(500).json({ result: "No categories found" })
    await prisma.$disconnect()
  }
}