export function expandRanges(input) {
    if (Array.isArray(input)) return input.join(",");
    const result = [];
    const parts = input.split(",");
    for (let part of parts) {
      part = part.trim();
      // Maneja rangos tipo "7-10,15,20-22"
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            result.push(i);
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num)) {
          result.push(num);
        }
      }
    }
    return result.join(",");
  }


function getColorSheetRanges(pages, offset) {
    console.log("Input pages:", pages);
  // Expande rangos tipo "7-10,15,20-22" a "7,8,9,10,15,20,21,22"
  const expanded = expandRanges(pages);
  const pageList = expanded.split(",").map(Number);

  console.log("Expanded pages:", expanded);
  console.log("Page list:", pageList);

  const result = [];
  for (let i = 0; i < pageList.length; i++) {
    const curr = pageList[i];
    const prev = i > 0 ? pageList[i - 1] : null;
    // Aplica la lógica del offset solo al momento de armar el rango
    if (i > 0 && curr - prev === 1 && curr % 2 === 0) {
      continue;
    }
    if (curr % 2 === 1) {
      result.push(`${curr + offset}-${curr + offset + 1}`);
    } else {
      result.push(`${curr + offset - 1}-${curr + offset}`);
    }
  }

  return result.join(", ");
}

export default getColorSheetRanges;