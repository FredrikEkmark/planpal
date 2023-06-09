import Box from "@/components/basic/box"
import Button from "@/components/basic/button"
import InputCategory from "@/components/basic/inputCategroy"
import InputDate from "@/components/basic/inputDate"
import Main from "@/components/basic/main"
import Header from "@/components/header"
import AddTaskCard from "@/components/toDo/addTaskCard"
import { UserContext } from "@/context/user-context-provider"
import { NextPage } from "next"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

interface Props {}

const AddTask: NextPage<Props> = ({}) => {
  return (
    <div className="h-screen">
      <Header currentPage={"Add Task"} link="/toDo" />
      <Main>
        <AddTaskCard />
      </Main>
    </div>
  )
}

export default AddTask
