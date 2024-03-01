import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { BotonConfirmar } from "../components/BotonConfimar";
import { fetchApiBodas, queries } from "../utils/Fetching";
import { useEffect, useState } from "react";


export default function Resync() {
  const [data, setData] = useState({ olts: [], onus: [] })
  const [oltsOptions, setOltsOptions] = useState([])
  const [onusOptions, setOnusOptions] = useState([])
  const [oltsValue, setOltsValue] = useState([])
  const [onusValue, setOnusValue] = useState([])
  const [value, setValue] = useState({ olts: [], onus: [] })

  useEffect(() => {
    fetchApiBodas({
      query: queries.resyncOnus,
    }).then(data => {
      setData(JSON.parse(data))
    })
  }, [])

  useEffect(() => {
    console.log(data?.onus)
    setOltsOptions(data?.olts?.map(elem => {
      return { value: elem?.id, label: elem?.name }
    }))
    setOltsValue(oltsOptions?.filter(elem => elem.label.toLowerCase() === "4net - polar"))
    setOnusOptions(data?.onus?.map(elem => {
      return { value: elem, label: elem }
    }))
    setOnusValue(onusOptions?.filter(elem => ["hwtc", "vsol"].includes(elem.label.toLowerCase())))
  }, [data])

  useEffect(() => {
    setValue({ olts: oltsValue?.map(elem => elem.value), onus: onusValue?.map(elem => elem.value) })
  }, [oltsValue, onusValue])

  useEffect(() => {
    console.log(value)
  }, [value])

  const handlerClick = () => {
    fetchApiBodas({
      query: queries.resyncOnus,
      variables: {
        args: JSON.stringify(value)
      }
    }).then(data => {
      //setData(JSON.parse(data))
    })
  }

  const animatedComponents = makeAnimated()

  return (
    <>
      <div className="w-[100%] h-[calc(100vh-130px)] md:h-[calc(100vh-160px)] flex justify-center">
        <div className="w-[98%] 2xl:w-[80%] h-[90%] border border-gray-300 bg-white rounded-xl mt-10 p-2">
          <span className="font-display text-lg 2xl:text-2xl font-medium">Resincronización masiva de onus</span>
          <div className="w-[100%] h-[92%] 2xl:h-[95%] mt-2 overflow-auto grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <span >Olts</span>
              <div className="bg-red-100 w-[calc(100%-16px)] ml-4 mt-4">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  isSearchable={false}
                  value={oltsValue}
                  onChange={(e) => { setOltsValue(e) }}
                  options={oltsOptions} />
              </div>
            </div>
            <div className="col-span-1">
              <span >Onus</span>
              <div className="bg-red-100 w-[calc(100%-16px)] ml-4 mt-4">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  isSearchable={false}
                  value={onusValue}
                  onChange={(e) => { setOnusValue(e) }}
                  options={onusOptions} />
              </div>
            </div>
            <div className="col-span-1">
              {/* <span >Confirmar</span> */}
              <div className="w-full font-dsplay flex text-gray-600 bottom-0 cursor-pointer ">
                <div className="rounded-2xl w-40 ml-10 mt-10 truncate">
                  <BotonConfirmar onClick={handlerClick} disabled={value?.olts?.length === 0 || value?.onus?.length === 0} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}