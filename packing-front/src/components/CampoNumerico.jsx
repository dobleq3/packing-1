import React from "react";
import { useForm } from "../context/FormContext";
import { useFormActions } from "../hooks/useFormActions";

export default function CampoNumerico({ campo, label }) {
  const { formData } = useForm();
  const { handleChange } = useFormActions();

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type="number"
        name={campo}
        value={formData[campo] || ""}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}
