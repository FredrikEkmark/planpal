import Link from "next/link"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  href: string
  className?: string
}

const CategoryBox = (props: Props) => {
  return (
    <Link
      className={`${props.className} flex items-center px-4 my-2 w-[48%] h-20 bg-white border-solid border-slate-300 border-[1px] rounded-[10px]`}
      href={props.href}
    >
      <div className="flex flex-col justify-center">{props.children}</div>
    </Link>
  )
}

export default CategoryBox
