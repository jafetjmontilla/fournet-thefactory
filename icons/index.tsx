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
export const CheckIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}
export const EditarIcon: FC<propsIcon> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23" {...props} >
      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" stroke="currentColor" />
    </svg>

  )
}
export const SubirImagenIcon: FC<propsIcon> = (props) => {
  return (
    <svg width={43} height={43} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.9596 2.065C12.2719 1.44421 12.7505 0.922388 13.342 0.557755C13.9335 0.193122 14.6148 2.14342e-05 15.3096 0H24.7196C25.4164 2.35375e-05 26.0994 0.194181 26.692 0.560696C27.2846 0.92721 27.7634 1.45158 28.0746 2.075L29.5371 5H33.7621C35.4198 5 37.0095 5.65848 38.1816 6.83058C39.3537 8.00268 40.0121 9.5924 40.0121 11.25V20.6525C38.5902 19.4724 36.9443 18.5923 35.1733 18.0652C33.4023 17.538 31.5429 17.3747 29.7071 17.585C29.1122 15.2205 27.6742 13.1547 25.6635 11.7756C23.6528 10.3966 21.2078 9.79921 18.7877 10.0958C16.3676 10.3923 14.1391 11.5624 12.5209 13.3862C10.9027 15.2099 10.0061 17.5618 9.99965 20C9.99974 22.2324 10.7464 24.4006 12.1209 26.1596C13.4953 27.9187 15.4186 29.1675 17.5847 29.7075C17.2784 32.3877 17.7707 35.0986 18.9996 37.5H6.26465C4.60705 37.5 3.01733 36.8415 1.84523 35.6694C0.673129 34.4973 0.0146484 32.9076 0.0146484 31.25V11.25C0.0146484 9.5924 0.673129 8.00268 1.84523 6.83058C3.01733 5.65848 4.60705 5 6.26465 5H10.4896L11.9621 2.065H11.9596Z" fill="currentColor" />
      <path d="M19.9993 12.5C23.4818 12.5 26.4093 14.875 27.2543 18.09C25.0921 18.7488 23.1252 19.9294 21.5269 21.5277C19.9287 23.126 18.7481 25.0929 18.0893 27.255C16.3288 26.7888 14.798 25.6982 13.7824 24.1865C12.7667 22.6749 12.3356 20.8454 12.5694 19.0393C12.8032 17.2333 13.686 15.5739 15.053 14.3707C16.4201 13.1675 18.1781 12.5026 19.9993 12.5Z" fill="currentColor" />
      <path d="M42.5 31.25C42.5 34.2337 41.3147 37.0952 39.205 39.205C37.0952 41.3147 34.2337 42.5 31.25 42.5C28.2663 42.5 25.4048 41.3147 23.295 39.205C21.1853 37.0952 20 34.2337 20 31.25C20 28.2663 21.1853 25.4048 23.295 23.295C25.4048 21.1853 28.2663 20 31.25 20C34.2337 20 37.0952 21.1853 39.205 23.295C41.3147 25.4048 42.5 28.2663 42.5 31.25ZM32.5 26.25C32.5 25.9185 32.3683 25.6005 32.1339 25.3661C31.8995 25.1317 31.5815 25 31.25 25C30.9185 25 30.6005 25.1317 30.3661 25.3661C30.1317 25.6005 30 25.9185 30 26.25V30H26.25C25.9185 30 25.6005 30.1317 25.3661 30.3661C25.1317 30.6005 25 30.9185 25 31.25C25 31.5815 25.1317 31.8995 25.3661 32.1339C25.6005 32.3683 25.9185 32.5 26.25 32.5H30V36.25C30 36.5815 30.1317 36.8995 30.3661 37.1339C30.6005 37.3683 30.9185 37.5 31.25 37.5C31.5815 37.5 31.8995 37.3683 32.1339 37.1339C32.3683 36.8995 32.5 36.5815 32.5 36.25V32.5H36.25C36.5815 32.5 36.8995 32.3683 37.1339 32.1339C37.3683 31.8995 37.5 31.5815 37.5 31.25C37.5 30.9185 37.3683 30.6005 37.1339 30.3661C36.8995 30.1317 36.5815 30 36.25 30H32.5V26.25Z" fill="currentColor" />
    </svg>
  )
}
export const FolderPlus: FC<propsIcon> = (props) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M.5 3l.04.87a1.99 1.99 0 00-.342 1.311l.637 7A2 2 0 002.826 14H9v-1H2.826a1 1 0 01-.995-.91l-.637-7A1 1 0 012.19 4h11.62a1 1 0 01.996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0013.81 3H9.828a2 2 0 01-1.414-.586l-.828-.828A2 2 0 006.172 1H2.5a2 2 0 00-2 2zm5.672-1a1 1 0 01.707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 011-.98h3.672z" />
      <path d="M13.5 10a.5.5 0 01.5.5V12h1.5a.5.5 0 110 1H14v1.5a.5.5 0 11-1 0V13h-1.5a.5.5 0 010-1H13v-1.5a.5.5 0 01.5-.5z" />
    </svg>
  )
}

export const TableCells: FC<propsIcon> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 01-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z" />
    </svg>
  )
}
export const IconFolderArrowDown: FC<propsIcon> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M22 8v5.81c-.88-.51-1.9-.81-3-.81-3.31 0-6 2.69-6 6 0 .34.04.67.09 1H4a2 2 0 01-2-2V6c0-1.11.89-2 2-2h6l2 2h8a2 2 0 012 2m-2 8h-2v4h-2l3 3 3-3h-2v-4z" />
    </svg>
  );
}
export const IconAddCircleLine: FC<propsIcon> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  );
}
export const IconUsdSquare: FC<propsIcon> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M11 9h4a1 1 0 000-2h-2V6a1 1 0 00-2 0v1a3 3 0 000 6h2a1 1 0 010 2H9a1 1 0 000 2h2v1a1 1 0 002 0v-1a3 3 0 000-6h-2a1 1 0 010-2zm8-7H5a3 3 0 00-3 3v14a3 3 0 003 3h14a3 3 0 003-3V5a3 3 0 00-3-3zm1 17a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h14a1 1 0 011 1z" />
    </svg>
  );
}
export const IconDelete: FC<propsIcon> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z" />
    </svg>
  );

}
export const IconCancel: FC<propsIcon> = (props) => {
  return (
    <svg
      viewBox="0 0 470 1000"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M452 656c12 12 18 26.333 18 43s-6 31-18 43c-12 10.667-26.333 16-43 16s-31-5.333-43-16L234 590 102 742c-12 10.667-26.333 16-43 16s-31-5.333-43-16C5.333 730 0 715.667 0 699s5.333-31 16-43l138-156L16 342C5.333 330 0 315.667 0 299s5.333-31 16-43c12-10.667 26.333-16 43-16s31 5.333 43 16l132 152 132-152c12-10.667 26.333-16 43-16s31 5.333 43 16c12 12 18 26.333 18 43s-6 31-18 43L314 500l138 156" />
    </svg>
  );
}


