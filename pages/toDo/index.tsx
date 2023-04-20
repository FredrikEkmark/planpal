import Header from "@/components/header"
import NavBar from "@/components/navBar"
import ToDoCategories from "@/components/toDo/toDoCategories"
import { UserContext } from "@/context/user-context-provider"
import { addTaskFetch } from "@/functions/addTaskFetch"
import { ToDo } from "@/types/toDo"
import { User } from "@/types/user"
import { NextPage } from "next"
import { useContext, useEffect } from "react"

// start of boilerpalte getServerSideProps
export async function getServerSideProps() {
  const username = "fredrik@gmail.com"
  const password = "fasfsafsafsafafsa"

  const headers = new Headers()
  headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`)

  const res = await fetch(
    `${
      process.env.URL
    }/api/user/getFullUserData?id=${"clglz54lr0000vq0xpjzkd8jy"}`,
    {
      headers,
      credentials: "include",
    }
  )
  const json = await res.json()

  const data = JSON.parse(JSON.stringify(json.result)) as Data

  return {
    props: {
      data: {
        user: data.user,
        toDo: data.toDo,
        calendar: null,
      },
    },
  }
}

interface Data {
  user: User
  toDo: ToDo
  calendar: string | null
}

// end of boilerpalte getServerSideProps

interface Props {
  data: Data
}

const Index: NextPage<Props> = ({ data }) => {
  // start boilerplate for page //

  const {
    user,
    setUser,
    currentPage,
    setCurrentPage,
    toDo,
    setToDo,
    addTask,
    editTask,
    deleteTask,
    calendar,
    setCalendar,
  } = useContext(UserContext)

  useEffect(
    () => {
      setCurrentPage("todo")
      setUser(data.user)
      setToDo(data.toDo)
    } // set name of folder so navBar know where you are
  )

  // end boilerplate for page //

  return (
    <div>
      <Header currentPage={currentPage} />
      <ToDoCategories categorys={toDo.category} />

      <NavBar currentPage={currentPage} />
    </div>
  )
}

export default Index
