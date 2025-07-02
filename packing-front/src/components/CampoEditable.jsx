import React from "react";
import { useForm } from "../context/FormContext";
import { useFormActions } from "../hooks/useFormActions";

export default function CampoEditable({ campo, label, tipo = "text", storageKey }) {
  const {
    formData, setFormData,
    editandoUC, setEditandoUC,
    editandoProducto, setEditandoProducto
  } = useForm();

  const esUC = campo === "uc_planificado";
  const editando = esUC ? editandoUC : editandoProducto;
  const setEditando = esUC ? setEditandoUC : setEditandoProducto;

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      {!editando ? (
        <div className="flex items-center justify-between">
          <span className="text-gray-800 font-semibold">
            {formData[campo] || "-"}
          </span>
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Editar
          </button>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            type={tipo}
            name={campo}
            value={formData[campo]}
            onChange={(e) => setFormData(prev => ({ ...prev, [campo]: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => {
              if (storageKey) localStorage.setItem(storageKey, formData[campo]);
              setEditando(false);
            }}
            className="px-3 py-2 bg-green-600 text-white rounded text-sm"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}
