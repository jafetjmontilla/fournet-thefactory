import { FC, HtmlHTMLAttributes, ReactNode } from "react";

interface propsComp extends HtmlHTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
export const ContainerIcon: FC<propsComp> = (props) => {
  return (
    <>
      <div
        {...props} className={`flex justify-center items-center cursor-pointer text-gray-600 md:hover:scale-110 hover:text-gray-800 rounded-sm ${props.className}`} >
        {props.children}
      </div>
    </>
  );
};
