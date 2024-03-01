import { Dispatch, FC, MouseEventHandler, SetStateAction } from "react"

interface props {
  caption: string
  onClick: MouseEventHandler<HTMLDivElement>
}

export const ButtonGradient1: FC<props> = ({ caption, onClick }) => {

  return (
    <div onClick={onClick} className="h-10 cursor-pointer rounded-full border-2 border-blue-900 inline-flex items-center justify-center px-3  bg-gradient-to-br from-cyan-500 to-blue-500 font-medium text-gray-900 hover:from-sky-600 hover:to-sky-900 hover:text-white active:from-cyan-500 active:to-blue-500 select-none">
      {caption}
    </div>
  )
}