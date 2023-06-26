import Link from "next/link"
import { IconFolderArrowDown, IconRouterNetwork } from "../icons"
import { FC, memo, useEffect } from "react";

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  //timeZone: "America/Los_Angeles",
};
const format = (date?: Date | number, locale?: string, options?: object) => {
  return new Intl.DateTimeFormat(locale, options)?.format(date);
};
interface propsListFileZip {
  logs: any
}



export const ListLog: FC<propsListFileZip> = ({ logs }) => {
  console.log(logs)
  return (
    <ul className="ml-2 mt-2">
      {
        logs?.results?.map((elem: any, idx: any) => {
          return (
            <li key={idx} className={`${idx % 2 === 0 ? "bg-gray-100" : "bg-white"} w-[1300px] 2xl:w-[100%] relative`}>
              <div className="flex">
                <IconRouterNetwork className="w-10 h-10 text-gray-600" />
                <div className="grid pl-2 w-[calc(100%-40px)]">
                  <div className="flex w-[100%]">
                    <div className="w-[15%]">
                      <span className="text-sm 2xl:text-md font-medium ml-2">{` Onu: ${elem?.sn_onu}`}</span>
                    </div>
                    <div className="w-[12%]">
                      <span className="text-sm 2xl:text-md font-medium ml-2">{` Servicio: ${elem?.id_servicio}`}</span>
                    </div>
                    <div className="w-[14%]">
                      <span className="text-sm 2xl:text-md font-medium ml-2">{` Estado: ${elem?.estadoValir}`}</span>
                    </div>
                    <div className="w-[34%] truncate">
                      <span className="text-sm 2xl:text-md font-medium ml-2">{` Usuario: ${elem?.usuario}`}</span>
                    </div>
                    {/* <div className="w-[10%]">
                      <span className="text-sm 2xl:text-md font-medium ml-2">{` Olt: ${elem?.smartOlt}`}</span>
                    </div> */}
                    <div className="group flex relative w-[25%]">
                      <span className="text-sm 2xl:text-md font-medium ml-2 max-w-[100%] truncate">{` Confirmación: ${elem?.confirmation}`}</span>
                      <span className="group-hover:opacity-100 transition-opacity bg-gray-800 w-[99%] px-1 text-sm text-gray-100 rounded-md absolute z-50 *left-1/2 *-translate-x-1/2 translate-y-[-16px] opacity-0 m-4 mx-auto">{`${elem?.confirmation}`}</span>
                    </div>
                  </div>
                  <span className="text-xs ml-2"> {`${format(new Date(elem?.createdAt), "es-ES", options)}`}</span>
                </div>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}
