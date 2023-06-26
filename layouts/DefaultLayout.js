import Image from "next/image";
import { useEffect, useState } from "react";


export const DefaultLayout = ({ children }) => {
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
        <div className="w-full h-[130px] md:h-[160px] flex justify-center md:justify-start">
          <div className="">
            <Image width={"280"} height={"100"} className="mt-6 ml-0 md:ml-10" alt="4net" src="http://96.126.110.203:4500/outFiles/4netLogo.png" />
          </div>
        </div >
        {children}
      </div >
    </>
  );
};

