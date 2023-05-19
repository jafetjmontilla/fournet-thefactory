import Link from "next/link"
import { IconFolderArrowDown } from "../icons"
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
  filesZip: any
}



export const ListFileZip: FC<propsListFileZip> = ({ filesZip }) => {
  return (
    <ul className="ml-2 mt-2">
      {
        filesZip?.results?.map((elem: any, idx: any) => {
          return (
            <li key={idx}>
              <Link href={`http://96.126.110.203:4500/${elem?.path}`} key={idx} className="flex pb-2" >
                <IconFolderArrowDown className="w-10 h-10 text-gray-600" />
                <div className="grid pl-2">
                  <span className="font-display  font-medium">{` ${elem?.path.split("/")[1]}`}</span>
                  <span className="text-xs"> {`${format(new Date(elem?.createdAt), "es-ES", options)}`}</span>
                </div>
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
}
