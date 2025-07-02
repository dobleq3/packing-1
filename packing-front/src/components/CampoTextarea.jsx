import React from "react";
import { useForm } from "../context/FormContext";
import { useFormActions } from "../hooks/useFormActions";

export default function CampoTextarea({ campo, label }) {
  const { formData } = useForm();
  const { handleChange } = useFormActions();

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <textarea
        name={campo}
        value={formData[campo]}
        onChange={handleChange}
        rows={2}
        className="w-full p-3 border border-gray-300 rounded-md resize-none"
      ></textarea>
    </div>
  );
}
