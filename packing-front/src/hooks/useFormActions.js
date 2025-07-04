import { toast } from "react-toastify";
import { useForm } from "../context/FormContext";

export const useFormActions = () => {
  const {
    formData, setFormData, setMensaje,
    setModalAbierto, setDescripcionProblema,
    setProblemaActivado
  } = useForm();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const payload = {
      ...formData,
      es_problema: false,
      uc_planificado: parseInt(formData.uc_planificado) || 0,
      uc_real: parseInt(formData.uc_real) || 0,
      nro_caja: parseInt(formData.nro_caja) || 0,
      observaciones: formData.observaciones || "",
      fecha_registro: now.toISOString().split("T")[0],
      hora_registro: now.toTimeString().slice(0, 5),
      hora: formData.hora
    };

    try {
      const result = await fetch("https://8002-dobleq3-packing1-i8zyk8q7m4v.ws-us120.gitpod.io/produccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        toast.success("Registro exitoso");
        setFormData(prev => ({ ...prev, hora: "", uc_real: "", observaciones: "", nro_caja: "" }));
        setProblemaActivado(false);
        setMensaje("");
      })
      .catch(error=>console.log(error))

    } catch {
      toast.error("Error al registrar");
      setMensaje("❌ Error al registrar");
    }
  };

  const enviarProblema = async () => {
    const now = new Date();
    const fecha = now.toISOString().split("T")[0];
    const hora = now.toTimeString().slice(0, 5);

    if (!formData.responsable || !formData.status || !formData.observaciones?.trim()) {
      toast.warning("Completa los campos del problema");
      return;
    }

    const payload = {
      descripcion: formData.observaciones,
      responsable: formData.responsable,
      status: formData.status,
      fecha,
      fecha_registro: fecha,
      hora_registro: hora
    };

    try {
      const res = await fetch("https://8002-dobleq3-packing1-i8zyk8q7m4v.ws-us120.gitpod.io/problemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();
      await res.json();

      toast.success("Problema registrado");
      setModalAbierto(false);
      setDescripcionProblema("");
      setFormData(prev => ({ ...prev, responsable: "", status: "" }));
      setProblemaActivado(true);

    } catch {
      toast.error("Error al enviar el problema");
    }
  };

  return {
    handleChange,
    handleSubmit,
    enviarProblema
  };
};
