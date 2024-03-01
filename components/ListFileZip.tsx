import Link from "next/link"
import { IconFolderArrowDown } from "../icons"
import { FC, memo, useEffect } from "react";
import { getDate, getDateTime } from "../utils/time";

interface propsListFileZip {
  filesZip: any
}

export const ListFileZip: FC<propsListFileZip> = ({ filesZip }) => {
  console.log(10005, filesZip)
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
                  <span className="text-xs"> {`${getDateTime(elem?.createdAt)}`}</span>
                </div>
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
}
