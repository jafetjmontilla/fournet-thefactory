import { useEffect, useRef, useState } from "react"
import { fetchApiBodas, queries } from "../utils/Fetching"
import { ListLog } from "../components/ListLog"

export default function Logs() {
  const [logs, setLogs] = useState<any>()
  const [isMounted, setIsMounted] = useState<any>(false)
  const intervalRef: any = useRef();

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    intervalRef.current = getInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = getInterval(logs?.results[0]?.createdAt);
  }, [logs]);

  const getInterval = (lasTime?: any) => {
    const progressInterval = setInterval(() => {
      fetchApiBodas({
        query: queries.getLog,
        variables: {
          time: lasTime
        },
      }).then((resp: any) => {
        if (resp?.results?.length > 0) {
          const newLogs = {
            total: resp.total,
            results: [...resp.results, ...logs.results]
          }
          setLogs(newLogs)
        }
      })
    }, 5000);
    return progressInterval;
  };

  useEffect(() => {
    if (isMounted) {
      fetchApiBodas({
        query: queries.getLog,
        variables: {
          limit: 500,
          skip: 0,
        },
      }).then((resp: any) => {
        setLogs(resp)
      })
    }
  }, [isMounted])

  return (
    <>
      <div className="w-[100%] h-[calc(100vh-130px)] md:h-[calc(100vh-160px)] flex justify-center">
        <div className="w-[98%] 2xl:w-[80%] h-[90%] border border-gray-300 bg-white rounded-xl mt-10 p-2">
          <span className="font-display text-lg 2xl:text-2xl font-medium">Logs de suspención y reconexión</span>
          <div className="w-[100%] h-[92%] 2xl:h-[95%] mt-2 overflow-auto">
            <ListLog logs={logs} />
          </div>
        </div>
      </div>
    </>
  )
}