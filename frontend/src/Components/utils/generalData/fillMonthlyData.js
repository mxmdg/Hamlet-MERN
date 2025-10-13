import { procesarFechaISO, getMyDate } from "./fechaDiccionario";

// Rellena los meses faltantes con el último valor conocido
export function fillMonthlyData(data) {
  console.log("Filling monthly data...");
  console.log(data.length);
  if (!data || data.length === 0) return [];

  const firstDate = new Date(data[0].Fecha);
  const lastDate = new Date(data[data.length - 1].Fecha);

  const filledData = [];

  const formatData = (item) => {
    return {
      Fecha: procesarFechaISO(item.Fecha),
      Valor: item.Valor * 100,
      Entrada: item.Entrada,
      Minimo: item.Minimo,
    };
  };

  const fill = () => {
    let prevMonth = getMyDate(firstDate).mm;
    let prevYear = getMyDate(firstDate).yy;
    let lastItem = data[0];

    filledData.push(formatData(lastItem)); // Primera entrada

    for (let i = 1; i < data.length; i++) {
      const curr = data[i];
      const { mm: currMonth, yy: currYear } = getMyDate(new Date(curr.Fecha));

      // Calcular la diferencia de meses considerando el cambio de año
      let diff = (currYear - prevYear) * 12 + (currMonth - prevMonth);

      // Si hay meses faltantes, rellenar
      while (diff > 1) {
        prevMonth++;
        if (prevMonth > 12) {
          prevMonth = 1;
          prevYear++;
        }
        // Crear nueva entrada con el último valor conocido
        const newFecha = `${prevMonth}/${prevYear}`;
        filledData.push({
          Fecha: newFecha,
          Valor: curr.Valor * 100,
          Entrada: curr.Entrada,
          Minimo: curr.Minimo,
        });
        diff--;
      }

      filledData.push(formatData(curr));
      prevMonth = currMonth;
      prevYear = currYear;
      lastItem = curr;
    }
  };

  fill();
  console.log(filledData);
  return filledData;
}
