import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FormProvider } from "./context/FormContext"; // 👈 asegúrate que la ruta sea correcta

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FormProvider> {/* 👈 Aquí envolvemos toda la app */}
      <App />
    </FormProvider>
  </React.StrictMode>
);
