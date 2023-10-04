import { CheckIcon } from "../icons";

export const BotonConfirmar = ({ onClick, disabled }) => {
  return (
    <div
      onClick={onClick}
      className={`flex gap-1 items-center justify-center  w-full  px-3 py-1 ${!disabled ? "bg-secondary hover:scale-105 transition transform" : "bg-gray-100"}`}
    >
      Confirmar <CheckIcon />
    </div>
  );
};
