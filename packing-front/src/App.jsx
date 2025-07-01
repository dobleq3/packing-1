import React, { useState, useEffect } from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


export default function RegistroEstuches() {
  const [formData, setFormData] = useState({
    hora: "",
    linea: "7",
    uc_planificado: 1000,
    nro_caja: "",
    uc_real: "",
    observaciones: "",
  });

  const [editandoUC, setEditandoUC] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [problemaActivado, setProblemaActivado] = useState(false); // checkbox visual
  const [modalAbierto, setModalAbierto] = useState(false); // controla popup
  const [descripcionProblema, setDescripcionProblema] = useState("");


  useEffect(() => {
    const ucGuardado = localStorage.getItem("uc_planificado");
    if (ucGuardado) {
      setFormData((prev) => ({
        ...prev,
        uc_planificado: parseInt(ucGuardado),
      }));
    }
  }, []); 
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const now = new Date();
    const fechaRegistro = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const horaRegistro = now.toTimeString().slice(0, 5);   // "HH:MM"
  
    const payload = {
      es_problema: false,
      hora: formData.hora,
      linea: formData.linea,
      uc_planificado: parseInt(formData.uc_planificado) || 0,
      nro_caja: parseInt(formData.nro_caja) || 0,
      uc_real: parseInt(formData.uc_real) || 0,
      observaciones: formData.observaciones || "",
      fecha_registro: fechaRegistro,
      hora_registro: horaRegistro,
    };
  
    try {
      const response = await fetch("http://localhost:8002/produccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)

        toast.success("Registro de producción exitoso", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,

        });

      })
      .catch(error=>console.log(error))
        
        setProblemaActivado(false);
      setMensaje("");
      setFormData((prev) => ({
        ...prev,
        hora: "",
        uc_real: "",
        observaciones: "",
        nro_caja: "",
      }));
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar");
      setMensaje("❌ Error al registrar");
    }
  };
  

  function generarHorasTurno() {
    const ahora = new Date();
    const horaActual = ahora.getHours();
  
    let inicioTurno = 0;
  
    if (horaActual >= 8 && horaActual < 16) {
      inicioTurno = 8; // Día
    } else if (horaActual >= 16 && horaActual < 24) {
      inicioTurno = 16; // Tarde
    } else {
      inicioTurno = 0; // Noche
    }
  
    const bloques = [];
    for (let i = 0; i < 8; i++) {
      const h1 = (inicioTurno + i) % 24;
      const h2 = (inicioTurno + i + 1) % 24;
      const format = (h) => String(h).padStart(2, "0") + ":00";
      bloques.push(`${format(h1)} a ${format(h2)}`);
    }
  
    return bloques;
  }



  const enviarProblema = async () => {

    const now = new Date();
    const fechaRegistro = now.toISOString().split("T")[0];
    const horaRegistro = now.toTimeString().split(" ")[0].slice(0,5); // "HH:MM"

    if (
      !descripcionProblema.trim() ||
      !formData.responsable ||
      !formData.status
    ) {
      toast.warning("Por favor, completa todos los campos del problema.");
      return;
    }
  
    const payload = {
      descripcion: descripcionProblema.trim(),
      responsable: formData.responsable,
      fecha: new Date().toISOString().split("T")[0],
      status: formData.status,
      //fecha: formData.hora, // o puedes enviar el bloque horario si es relevante
      fecha_registro: fechaRegistro,
      hora_registro: horaRegistro,
    };
  
    try {
      const response = await fetch("http://localhost:8002/problemas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        // Reset estado
        setDescripcionProblema("");
        setFormData((prev) => ({
          ...prev,
          responsable: "",
          status: "",
        }));
        setProblemaActivado(true);
        setModalAbierto(false);

        toast.success("Registro de problema exitoso", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
        });        

      })
      .catch(error=>console.log(error)) 


    } catch (error) {
      toast.error("Error al registrar problema");
      console.error(error);
    }
  };
      


  const formularioCompleto = () => {
    return (
      formData.hora &&
      formData.uc_planificado &&
      formData.uc_real &&
      formData.nro_caja &&
      formData.observaciones !== null
    );
  };

  
  //const fechaActual = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD

  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center border-b pb-2">
          Registro de Estuches
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Hora</label>
            <select
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            >
              <option value="" disabled>Selecciona hora</option>
              {generarHorasTurno().map((bloque) => (
                <option key={bloque} value={bloque}>{bloque}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">UC Planificado</label>

            {!editandoUC ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-semibold">{formData.uc_planificado}</span>
                <button
                  type="button"
                  onClick={() => setEditandoUC(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Editar
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="uc_planificado"
                  value={formData.uc_planificado}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("uc_planificado", formData.uc_planificado);
                    setEditandoUC(false);
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>

         
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">UC Real</label>
              <input
                type="number"
                name="uc_real"
                value={formData.uc_real}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">N° Caja</label>
              <input
                type="number"
                name="nro_caja"
                value={formData.nro_caja || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>



          <div>
            <label className="block text-gray-700 font-medium mb-1">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-200"
            ></textarea>
          </div>


          <div className="flex items-center gap-2">
          <input
              type="checkbox"
              id="activar-problema"
              checked={problemaActivado}
              onChange={(e) => {
                if (e.target.checked && !formularioCompleto()) {
                  toast.warning("Completa todos los campos antes de registrar un problema");
                  return;
                }

                if (e.target.checked) {
                  setModalAbierto(true); // abre modal
                  setProblemaActivado(true)
                } else {
                  setProblemaActivado(false); // desactiva si lo desmarca manualmente
                }
              }}
            />
            <label htmlFor="activar-problema" className="text-sm text-gray-700 select-none">
              Registrar un problema
            </label>
          </div>


          

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
      </div>


      <ToastContainer />


      {modalAbierto && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
          <h3 className="text-xl font-bold text-red-600">Registrar problema</h3>

          <div>
            <p className="text-sm text-gray-600">
              Fecha: {new Date().toLocaleDateString()}<br />
              Hora actual: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}<br />
              Bloque seleccionado: <span className="font-medium">{formData.hora || "Sin seleccionar"}</span>
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Descripción del problema</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-red-200"
              rows={4}
              value={descripcionProblema}
              onChange={(e) => setDescripcionProblema(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Responsable</label>
            <select
              value={formData.responsable || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, responsable: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
            >
              <option value="" disabled>Selecciona responsable</option>
              <option value="Operador">Operador</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Supervisor">Supervisor</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 mt-4">Estado</label>
            <select
              value={formData.status || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-200"
            >
              <option value="" disabled>Selecciona estado</option>
              <option value="Abierto">Abierto</option>
              <option value="En curso">En curso</option>
              <option value="Resuelto">Resuelto</option>
              <option value="Escalado">Escalado</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalAbierto(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              disabled={
                !descripcionProblema.trim() ||
                !formData.responsable ||
                !formData.status
              }
              className={`px-4 py-2 rounded text-white text-sm font-semibold transition-colors ${
                descripcionProblema.trim() &&
                formData.responsable &&
                formData.status
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={enviarProblema}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}



    </div>
    
  );
}
