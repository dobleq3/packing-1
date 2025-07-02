import React from "react";
import { useForm } from "../context/FormContext";
import { useFormActions } from "../hooks/useFormActions";

export default function ModalProblema() {
  const {
    formData, setFormData,
    descripcionProblema, setDescripcionProblema,
    setModalAbierto
  } = useForm();

  const { enviarProblema } = useFormActions();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-xl font-bold text-red-600">Registrar problema</h3>

        <p className="text-sm text-gray-600">
          Fecha: {new Date().toLocaleDateString()}<br />
          Hora actual: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}<br />
          Bloque seleccionado: <span className="font-medium">{formData.hora || "Sin seleccionar"}</span>
        </p>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Descripción del problema</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            rows={4}
            value={descripcionProblema}
            onChange={(e) => setDescripcionProblema(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Responsable</label>
          <select
            value={formData.responsable || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Selecciona responsable</option>
            <option value="Operador">Operador</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Estado</label>
          <select
            value={formData.status || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Selecciona estado</option>
            <option value="Abierto">Abierto</option>
            <option value="En curso">En curso</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Escalado">Escalado</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => setModalAbierto(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            disabled={
              !descripcionProblema.trim() || !formData.responsable || !formData.status
            }
            onClick={enviarProblema}
            className={`px-4 py-2 rounded text-white text-sm font-semibold ${
              descripcionProblema.trim() && formData.responsable && formData.status
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
