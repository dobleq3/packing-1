export const generarHorasTurno = () => {
  const ahora = new Date();
  const horaActual = ahora.getHours();
  let inicio = horaActual >= 8 && horaActual < 16 ? 8 : horaActual >= 16 && horaActual < 24 ? 16 : 0;

  return Array.from({ length: 8 }, (_, i) => {
    const h1 = String((inicio + i) % 24).padStart(2, "0") + ":00";
    const h2 = String((inicio + i + 1) % 24).padStart(2, "0") + ":00";
    return `${h1} a ${h2}`;
  });
};
