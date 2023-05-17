import { useCallback, useContext, useEffect, useState } from "react";
import { CheckIcon, EditarIcon, FolderPlus, SubirImagenIcon, TableCells } from "../icons";
import { fetchApi, queries } from "../utils/Fetching";

export const ModuloSubida = () => {
  const [cargado, setCargado] = useState({ titulo: "esperando archivo" });
  const [imagePreviewUrl, setImagePreviewUrl] = useState({
    file: undefined,
    preview: false,
    image: ``,
  });
  const [file, setFile] = useState<any>()

  useEffect(() => {
    console.log(120001, file)
  }, [file])



  const subir_archivo = async () => {
    const result: any = await fetchApi({
      query: queries.fileUpload, variables: {
        file,
      },
      type: "formData"
    })


  };

  const handleChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    setFile(file)
    if (file?.size < 5120000) {
      reader.onloadend = () => {
        console.log(1, e)
      };
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
        {imagePreviewUrl.preview == false && (
          <label
            htmlFor="file"
            className="hover:scale-120 transform font-display text-md font-medium flex flex-col items-center justify-center gap-1 cursor-pointer relative"
          >
            {file ?
              <>
                <TableCells className="w-20 h-20" />
                <span>{file?.name}</span>
              </>
              :
              <>
                <FolderPlus className="w-20 h-20" />
                <span>Añadir Archivo</span>
              </>
            }

          </label>
        )}

        {true && (
          <div className="w-full font-dsplay flex text-gray-500 bottom-0 cursor-pointer ">
            <BotonConfirmar onClick={subir_archivo} />

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



const BotonConfirmar = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex gap-1 items-center justify-center bg-secondary w-full  px-3 py-1 hover:scale-105 transition transform"
    >
      Confirmar <CheckIcon />
    </div>
  );
};
