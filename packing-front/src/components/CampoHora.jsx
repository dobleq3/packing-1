import React from "react";
import { useForm } from "../context/FormContext";
import { useFormActions } from "../hooks/useFormActions";
import { generarHorasTurno } from "../utils/generarHorasTurno";

export default function CampoHora() {
  const { formData } = useForm();
  const { handleChange } = useFormActions();

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">Hora</label>
      <select
        name="hora"
        value={formData.hora}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-md"
        required
      >
        <option value="" disabled>Selecciona hora</option>
        {generarHorasTurno().map((bloque) => (
          <option key={bloque} value={bloque}>{bloque}</option>
        ))}
      </select>
    </div>
  );
}
