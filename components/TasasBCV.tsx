import Link from "next/link"
import { CheckIcon, IconCancel, IconDelete, IconFolderArrowDown, IconUsdSquare } from "../icons"
import { FC, memo, useEffect, useRef, useState } from "react";
import { fetchApi, queries } from "../utils/Fetching";

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  // hour: "numeric",
  // minute: "numeric",
  // second: "numeric",
  // hour12: false,
  timeZone: "UTC"
};
const format = (date?: Date | number, locale?: string, options?: object) => {
  return new Intl.DateTimeFormat(locale, options)?.format(date);
};


interface propsTasaBCV {
  filesZip: any
  addTasa: boolean
  setAddTasa: any
  tasasBCV: any
  setTasasBCV: any
}



export const TasasBCV: FC<propsTasaBCV> = ({ filesZip, addTasa, setAddTasa, tasasBCV, setTasasBCV }) => {
  const refFecha = useRef(null)
  const refTasa = useRef(null)
  const [res, setRes] = useState<any>()
  const [showConfirmation, setShowConfirmation] = useState<any>({ value: false, values: [] })

  useEffect(() => {
    fetchApi({
      query: queries.getTasaBCV,
      variables: {
        limit: 0,
        skip: 0,
        sort: { fecha: -1 }
      },
    }).then((resp: any) => {
      setTasasBCV(resp)
      // const asd = resp?.results?.map((elem: any, idx: any) => { return false })
      // setShowConfirmation({ value: false, values: asd })
      setRes(null)
    })
  }, [res])

  useEffect(() => {
    const asd = tasasBCV?.results?.map((elem: any, idx: any) => { return false })
    setShowConfirmation({ value: false, values: asd })
  }, [tasasBCV?.results])

  const createTasa = async () => {
    const result: any = await fetchApi({
      query: queries.createTasaBCV,
      variables: {
        fecha: new Date(`${refFecha.current.value} 00:00:00`),
        tasa: parseFloat(refTasa.current.value)
      },
    })
    setRes(result)
    setAddTasa(!addTasa)
  }

  const deleteTasa = async (_id: any) => {
    const result: any = await fetchApi({
      query: queries.deleteTasaBCV,
      variables: { _id },
    })
    setRes(result)
  }

  return (
    <ul className="ml-2 mt-2">
      {addTasa &&
        <li >
          <div className="flex pb-2" >
            <CheckIcon className="w-8 h-8" onClick={createTasa} />
            <div className="flex items-center pl-2 ">
              <input ref={refFecha} type="date" className="w-28 h-6 border text-xs" />
              <input ref={refTasa} type="number" className="w-16 h-6 ml-4 border font-bold text-sm text-right" />
            </div>
          </div>
        </li>
      }
      {
        tasasBCV?.results?.map((elem: any, idx: any) => {
          return (
            <li key={idx}>

              <div className="flex pb-2" >
                <IconUsdSquare className="w-8 h-8 text-gray-600" />
                <div className="flex items-center pl-2">
                  <span className="w-16 text-xs">{`${format(new Date(elem?.fecha), "es-ES", options)}`}</span>
                  <span className="w-16 font-bold text-sm text-right">{elem?.tasa.toFixed(2)}</span>
                  <IconDelete className="w-6 h-6 ml-6 cursor-pointer text-gray-600" onClick={() => {
                    !showConfirmation?.value && setShowConfirmation((old: any) => {
                      old.values[idx] = true
                      return ({ value: true, values: old.values })
                    })
                  }} />
                  {showConfirmation?.values?.length > 0 && showConfirmation?.values[idx] &&
                    <>
                      <CheckIcon className="w-8 h-8 ml-4 cursor-pointer text-gray-600" onClick={() => { deleteTasa(elem?._id) }} />
                      <IconCancel className="w-8 h-8 ml-4 cursor-pointer text-gray-600" onClick={() => {
                        setShowConfirmation((old: any) => {
                          old.values[idx] = false
                          return ({ value: false, values: old.values })
                        })
                      }} />
                    </>
                  }
                </div>
              </div>
            </li>
          )
        })
      }
    </ul >
  )
}