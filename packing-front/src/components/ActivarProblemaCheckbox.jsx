import React from "react";
import { toast } from "react-toastify";
import { useForm } from "../context/FormContext";

export default function ActivarProblemaCheckbox() {
  const { problemaActivado, setProblemaActivado, setModalAbierto, formData } = useForm();

  const formularioCompleto = () =>
    formData.hora &&
    formData.uc_planificado &&
    formData.uc_real &&
    formData.nro_caja &&
    formData.observaciones !== null;

  const handleToggle = (e) => {
    if (e.target.checked && !formularioCompleto()) {
      toast.warning("Completa todos los campos antes de registrar un problema");
      return;
    }

    if (e.target.checked) {
      setModalAbierto(true);
      setProblemaActivado(true);
    } else {
      setProblemaActivado(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="activar-problema"
        checked={problemaActivado}
        onChange={handleToggle}
      />
      <label htmlFor="activar-problema" className="text-sm text-gray-700 select-none">
        Registrar un problema
      </label>
    </div>
  );
}
