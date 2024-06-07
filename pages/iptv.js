import { useState } from "react"

export default function Prueba() {
  const [url, setUrl] = useState()

  const channel = [
    { title: "Canal 001", url: "https://190.124.28.15/livestream/ESPN_EXTRA.m3u8" },
    { title: "Canal 002", url: "https://airtek.tv/livestream/HISTORY_CHANNEL_HD.m3u8" }
  ]

  return (
    <>
      <div className="md:absolute md:translate-x-[400px] md:translate-y-8 flex gap-6 m-auto my-2 md:my-0">
        {channel.map((elem, idx) => {
          return <div key={idx} onClick={() => setUrl(elem.url)} className="first-letter:font-bold bg-green-700 w-20 h-20 border-gray-400 border-2 cursor-pointer md:hover:scale-125 hover:bg-green-900 rounded-2xl flex justify-center items-center font-semibold text-sm"><span className="first-letter:text-red-400 first-letter:text-2xl">{elem.title}</span> </div>
        }
        )}
      </div>
      <embed className="border-2 border-black bg-black" src={url}></embed>
    </>
    // <iframe width="420" height="315" controls="0"
    //   src="https://stream.sistemasjaihom.com/mystream/">
    // </iframe>
  )
}