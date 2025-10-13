// Rellena los meses faltantes con el último valor conocido
export function fillMonthlyData(
  data,
  valueKey = ["Valor", "Minimo", "Entrada"]
) {
  if (!data || data.length === 0) return [];

  // Ordenar por fecha ascendente
  const sorted = data;

  const result = [];
  let current = new Date(sorted[0].Fecha);
  const end = new Date(sorted[sorted.length - 1].Fecha);
  let dataIdx = 0;
  let lastValue = sorted[0][valueKey[0]];
  let lastMin = sorted[0][valueKey[1]];
  let lastEntry = sorted[0][valueKey[2]];

  while (
    current.getFullYear() < end.getFullYear() ||
    (current.getFullYear() === end.getFullYear() &&
      current.getMonth() <= end.getMonth())
  ) {
    // Buscar si hay dato para este mes
    const monthData = sorted.find(
      (d) =>
        new Date(d.Fecha).getFullYear() === current.getFullYear() &&
        new Date(d.Fecha).getMonth() === current.getMonth()
    );
    dataIdx++;
    if (monthData) {
      lastValue = monthData[valueKey];
      result.push({ ...monthData });
    } else {
      // Crear un punto con la fecha y el último valor conocido
      result.push({
        Fecha: new Date(current),
        [valueKey[0]]: sorted[dataIdx - 1]
          ? sorted[dataIdx - 1][valueKey[0]]
          : lastValue,
        [valueKey[1]]: sorted[dataIdx - 1]
          ? sorted[dataIdx - 1][valueKey[1]]
          : lastMin,
        [valueKey[2]]: sorted[dataIdx - 1]
          ? sorted[dataIdx - 1][valueKey[2]]
          : lastEntry,
        // Puedes copiar otros campos si lo necesitas
      });
    }
    // Avanzar al siguiente mes
    current.setMonth(current.getMonth() + 1);
  }
  return result;
}
