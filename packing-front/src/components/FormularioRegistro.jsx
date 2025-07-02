import React from "react";
import CampoHora from "./CampoHora";
import CampoEditable from "./CampoEditable";
import CampoNumerico from "./CampoNumerico";
import CampoTextarea from "./CampoTextarea";
import ActivarProblemaCheckbox from "./ActivarProblemaCheckbox";
import ModalProblema from "./ModalProblema";
import { useForm } from "../context/FormContext";
import { useFormActions } from "../hooks/useFormActions";
import { ToastContainer } from "react-toastify";

export default function FormularioRegistro() {
  const { editandoUC, modalAbierto, mensaje } = useForm();
  const { handleSubmit } = useFormActions();

  return (
    <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center border-b pb-2">
        Registro de Estuches
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <CampoHora />
        <CampoEditable campo="nombre_producto" label="Nombre del producto" storageKey="nombre_producto" />
        <CampoEditable campo="uc_planificado" label="UC Planificado" tipo="number" storageKey="uc_planificado" />
        <div className="flex gap-4">
        <div className="w-1/2">
            <CampoNumerico campo="uc_real" label="UC Real" />
        </div>

        <div className="w-1/2">
            <CampoNumerico campo="nro_caja" label="N° Caja" />
        </div>
        </div>

        <CampoTextarea campo="observaciones" label="Observaciones" />
        <ActivarProblemaCheckbox />

        <button
          type="submit"
          disabled={editandoUC}
          className={`w-full py-3 rounded-md font-semibold transition-colors ${
            editandoUC
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Registrar producción
        </button>
      </form>

      {mensaje && (
        <div className="mt-4 text-center text-sm font-medium text-gray-800">
          {mensaje}
        </div>
      )}

      <ToastContainer />

      {modalAbierto && <ModalProblema />}
    </div>
  );
}
