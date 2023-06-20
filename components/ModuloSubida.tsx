import { useEffect, useState } from "react";
import { CheckIcon, EditarIcon, FolderPlus, TableCells } from "../icons";
import { fetchApi, queries } from "../utils/Fetching";

export const ModuloSubida = ({ setFilesZip }) => {
  const [file, setFile] = useState<any>()
  const [disabled, setDisabled] = useState<any>(true)

  const subir_archivo = async () => {
    if (file) {
      await fetchApi({
        query: queries.fileUpload,
        variables: { file, },
        type: "formData"
      }).then((result) => {
        setFilesZip((old: any) => {
          old?.results?.unshift(result)
          old.total = old?.total + 1
          const asd = {
            total: old?.total,
            results: old?.results.length > 7 ? old?.results.slice(0, 7) : old?.results
          }
          return asd
        })
      })
      setFile(null)
      setDisabled(true)
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    setFile(file)
    e.target.value = null;
    if (file?.size < 5120000) {
      reader.onloadend = () => {
        //console.log(10002, e)
      };
      setDisabled(false)
    } else {

    }
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className=" w-full z-10 h-full bg-gradient-to-r from-gray-300 to-gray-500 rounded-xl shadow-lg flex flex-col text-white items-center justify-center  overflow-hidden">
        <input
          id="file"
          type="file"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          required
          onChange={(e) => handleChange(e)}
          className="hidden"
        />
        <label
          htmlFor="file"
          className="hover:scale-120 transform  flex flex-col items-center justify-center gap-1 cursor-pointer relative"
        >
          {file ?
            <>
              <TableCells className="w-20 h-20" />
              <span>{file?.name}</span>
            </>
            :
            <>
              <FolderPlus className="w-20 h-20" />
              <span className="font-display text-md font-medium">Añadir Archivo</span>
            </>
          }
        </label>

        {true && (
          <div className="w-full font-dsplay flex text-gray-600 bottom-0 cursor-pointer ">
            <BotonConfirmar onClick={subir_archivo} disabled={disabled} />

            <label
              htmlFor="file"
              className="flex gap-1 items-center justify-center w-full bg-white px-3 py-1 hover:scale-105 transition transform cursor-pointer"
            >
              Cambiar <EditarIcon />
            </label>
          </div>
        )}
      </div>
      <br />
      <br />

    </>
  );
};



const BotonConfirmar = ({ onClick, disabled }) => {
  return (
    <div
      onClick={onClick}
      className={`flex gap-1 items-center justify-center  w-full  px-3 py-1 ${!disabled ? "bg-secondary hover:scale-105 transition transform" : "bg-gray-100"}`}
    >
      Confirmar <CheckIcon />
    </div>
  );
};
