import dynamic from "next/dynamic";
import { ComponentType, Dispatch, MouseEventHandler, RefObject, useEffect, useRef, useState } from "react";
import { Menu } from "../components/Menu";
import { MenuButton } from "../components/MenuButton";
import { SectionSwiper } from "../components/SectionSwiper";
import { ModuloSubida } from "../components/ModuloSubida";


export default function Home() {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [innerHeight, setInnerHeight] = useState(0)
  useEffect(() => {
    setInnerHeight(window.innerHeight)
    console.log(navigator.userAgent)
  }, [])
  return (
    <>
      <div style={{ height: `${innerHeight}px` }} className="w-screen bg-green-500">
        {/* <MenuButton setShowMenu={setShowMenu} />
        <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
        <SectionSwiper /> */}
        <div className="w-80 h-80">
          <ModuloSubida />
        </div>
      </div>
    </>
  )
}