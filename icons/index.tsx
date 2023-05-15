import React, { FC } from "react";

interface propsIcon {
  className?: string;
  onClick?: VoidFunction
}

export const DownloadIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

export const UploadIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  )
}

export const SendIcon: FC<propsIcon> = (props) => {
  return (
    <svg width={281} height={281} viewBox="0 0 281 281" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M152.217 143.331L43.9441 161.386C42.6994 161.594 41.5312 162.126 40.5572 162.928C39.5831 163.731 38.8376 164.776 38.3954 165.958L1.06353 265.965C-2.50147 275.165 7.1154 283.933 15.9417 279.52L274.692 150.145C276.484 149.25 277.991 147.874 279.045 146.17C280.098 144.466 280.657 142.503 280.657 140.5C280.657 138.496 280.098 136.533 279.045 134.829C277.991 133.125 276.484 131.749 274.692 130.854L15.9417 1.4789C7.1154 -2.93422 -2.50147 5.8489 1.06353 15.0345L38.4098 115.041C38.8499 116.226 39.5945 117.274 40.5687 118.079C41.5429 118.884 42.7121 119.418 43.9585 119.627L152.231 137.668C152.897 137.784 153.501 138.132 153.936 138.65C154.371 139.168 154.61 139.823 154.61 140.5C154.61 141.176 154.371 141.831 153.936 142.349C153.501 142.867 152.897 143.215 152.231 143.331H152.217Z" fill="currentColor" />
    </svg>
  )
}

export const CameraIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};

export const MicIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  );
};

export const PlusIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

export const ArrowLeft: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        color="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

export const SearchIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        d="M23.0065 22.2154L17.7686 16.9472C19.5414 14.9941 20.4848 12.4203 20.3944 9.77737C20.306 7.1344 19.1916 4.63178 17.289 2.80522C15.3864 0.978661 12.853 -0.0295042 10.2232 0.000147758C7.59538 0.0297997 5.08157 1.09331 3.22225 2.96336C1.36293 4.83341 0.305518 7.36173 0.274071 10.0067C0.244589 12.6497 1.245 15.2017 3.06108 17.1133C4.87716 19.0248 7.36542 20.1457 9.99323 20.2366C12.621 20.3275 15.1801 19.3787 17.1219 17.5956L22.3618 22.8657C22.4483 22.9527 22.5643 23.0001 22.6842 23.0001C22.806 23.0001 22.922 22.9507 23.0065 22.8657C23.093 22.7787 23.1401 22.6621 23.1401 22.5415C23.1401 22.4209 23.093 22.3023 23.0065 22.2154ZM1.21159 10.1332C1.21159 8.31454 1.74816 6.53938 2.75251 5.02714C3.75685 3.51489 5.18377 2.3387 6.85441 1.64286C8.52504 0.947032 10.3608 0.765167 12.1336 1.11901C13.9065 1.47286 15.5338 2.34858 16.8134 3.6335C18.0909 4.91841 18.9616 6.55717 19.3134 8.34024C19.6652 10.1233 19.4844 11.9716 18.7926 13.6499C18.1007 15.3302 16.9293 16.7653 15.4277 17.7755C13.9241 18.7856 12.1592 19.3253 10.3509 19.3253C7.92754 19.3233 5.60634 18.3527 3.89247 16.6309C2.17663 14.9072 1.21356 12.5706 1.21159 10.1332Z"
        fill="currentColor"
      />
    </svg>
  )
}
export const Close: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
export const Bars3: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}
