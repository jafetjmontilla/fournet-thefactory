import { FC } from "react";
import { getDateTime } from "../utils/time";

interface props {
  data: any
  interLine?: number
}

export const TreeItem: FC<props> = ({ data, interLine = 1 }) => {

  return (
    <ul className="py-1">
      {data?.map((item, idx) => (
        <li key={idx} className={`flex flex-col hover:bg-gray-200 px-3 ${interLine ? "py-1" : "py-0"}`}>
          <div className="flex">
            <span className="uppercase w-[150px]">{item.key}:</span>
            {typeof item.value === "object" ? (
              <TreeItem data={item.value} interLine={0} />
            ) : (
              <strong className=" flex-1">
                {typeof item.value !== "number"
                  ? item.value.slice(-4) !== "000Z"
                    ? item.value
                    : getDateTime(item.value)
                  : ["sub_total", "total_cobrado", "total", "total_facturas", "monto"].includes(item.key)
                    ? item.value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : item.value
                }
              </strong>
            )}
          </div>
          {item.key === "comprobante_pago" &&
            <div className="flex-1 h-[300px] bg-gray-100 flex justify-center items-center p-2">
              <img src={item.value} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '440px', minHeight: '350px' }}/>

            </div>}
        </li>
      ))}
    </ul>
  );
}