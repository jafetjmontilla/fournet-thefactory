import dynamic from "next/dynamic";
import { ComponentType, Dispatch, MouseEventHandler, RefObject, useEffect, useRef, useState } from "react";
import { Menu } from "../components/Menu";
import { MenuButton } from "../components/MenuButton";
import { SectionSwiper } from "../components/SectionSwiper";
import { ModuloSubida } from "../components/ModuloSubida";
import Image from "next/image";
import { fetchApi, queries } from "../utils/Fetching";
import Link from "next/link";
import { IconAddCircleLine, IconFolderArrowDown } from "../icons";
import { ListFileZip } from "../components/ListFileZip";
import { TasasBCV } from "../components/TasasBCV";



export default function Home() {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [innerHeight, setInnerHeight] = useState(0)
  const [filesZip, setFilesZip] = useState<any>()
  const [tasasBCV, setTasasBCV] = useState<any>()
  const [addTasa, setAddTasa] = useState<any>(false)

  useEffect(() => {
    setInnerHeight(window.innerHeight)
    console.log(navigator.userAgent)
    fetchApi({
      query: queries.getUploadFiles,
      variables: {
        limit: 7,
        skip: 0,
        sort: { createdAt: -1 }
      },
    }).then((resp: any) => {
      setFilesZip(resp)
    })
    fetchApi({
      query: queries.getTasaBCV,
      variables: {
        limit: 0,
        skip: 0,
        sort: { fecha: -1 }
      },
    }).then((resp: any) => {
      setTasasBCV(resp)
    })
  }, [])

  return (
    <>
      <div style={{ height: `${innerHeight}px` }} className="flex w-[100%] *bg-blue-100">
        {/* <MenuButton setShowMenu={setShowMenu} />
        <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
        <SectionSwiper /> */}
        <div className="bg-violet-200 w-full">
          <div className="flex">
            <Image width={"400"} height={"200"} className="*bg-red-200 mt-4 ml-10" alt="4net" src="http://96.126.110.203:4500/outFiles/4netLogo.png" />
          </div>
          <div className="*bg-green-100 flex  w-full ">
            <div className="*bg-red-300 w-[25%] flex justify-center">
              <div className="w-80 h-60 mt-10">
                <ModuloSubida setFilesZip={setFilesZip} />
              </div>
            </div>
            <div className="*bg-violet-100 w-[50%] h-[400px] flex justify-center">
              <div className="w-[80%] h-[400px] border border-gray-300 bg-white rounded-xl mt-10 p-2">
                <span className="font-display text-2xl font-medium">Descargar archivo zip</span>
                <ListFileZip filesZip={filesZip} />
              </div>
            </div>
            <div className="*bg-violet-100 w-[25%] h-[400px] flex justify-center">
              <div className="w-[85%] h-[300px] border border-gray-300 bg-white rounded-xl mt-10 p-2">
                <div className="flex">
                  <span className="font-display text-lg font-medium">Tasa diaria BCV</span>
                  <IconAddCircleLine className="ml-10 w-8 h-8 cursor-pointer text-gray-600" onClick={() => { setAddTasa(!addTasa) }} />
                </div>
                <div className=" h-[90%] overflow-auto">
                  <TasasBCV filesZip={filesZip} addTasa={addTasa} setAddTasa={setAddTasa} tasasBCV={tasasBCV} setTasasBCV={setTasasBCV} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
