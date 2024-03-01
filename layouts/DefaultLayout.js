import Image from "next/image";
import { useEffect, useState } from "react";
import { ButtonGradient1 } from "../components/buttoms/ButtomGradient1";
import { useRouter } from "next/router";


export const DefaultLayout = ({ children }) => {
  const router = useRouter()
  const [innerHeight, setInnerHeight] = useState(0)
  useEffect(() => {
    setInnerHeight(window.innerHeight)
  }, [])

  return (
    <>
      <div style={{ height: `${innerHeight}px` }} className="bg-violet-300 flex flex-col w-[100%]">
        {/* <MenuButton setShowMenu={setShowMenu} />
        <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
        <SectionSwiper /> */}
        <div className="w-full h-[130px] md:h-[100px] flex justify-center md:justify-start space-x-10 items-end">
          <div className="">
            <Image width={"280"} height={"100"} className="mt-6 ml-0 md:ml-10" alt="4net" src="http://96.126.110.203:4500/outFiles/4netLogo.png" />
          </div>
          <div className="inline-flex space-x-4">
            <ButtonGradient1 caption="Facturas Thefactory" className="algo" onClick={() => router.push("/thefactory")} />
            <ButtonGradient1 caption="Conciliaciones" className="algo" onClick={() => router.push("/conciliator")} />
          </div>
        </div >
        {children}
      </div >
    </>
  );
};

