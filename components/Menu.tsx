import { Dispatch, FC, useEffect, useRef } from "react"

interface props {
  showMenu: boolean
  setShowMenu: Dispatch<boolean>
}

const useOutsideSetShow = (ref: any, setShow: any) => {
  console.log(123, ref?.current)
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShow(false)
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};


export const Menu: FC<props> = ({ showMenu, setShowMenu }) => {



  const wrapperRef = useRef(null);
  useOutsideSetShow(wrapperRef, setShowMenu);


  return (
    <>
      <div ref={wrapperRef} className="bg-red-500 absolute z-20 w-60 h-[100%] ">

      </div>

    </>
  )
}