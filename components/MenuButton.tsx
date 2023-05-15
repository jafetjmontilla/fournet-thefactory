import { Dispatch, FC } from "react"
import { Bars3 } from "../icons"
import { ContainerIcon } from "./ContainerIcon"

interface props {
  setShowMenu: Dispatch<boolean>
}

export const MenuButton: FC<props> = ({ setShowMenu }) => {
  return (
    <>
      <ContainerIcon onClick={() => { setShowMenu(true) }} className="bg-white absolute z-10 translate-x-5 text-gray-700 translate-y-5 w-7 h-7">
        <Bars3 className="w-7 h-7" />
      </ContainerIcon>
    </>
  )
}