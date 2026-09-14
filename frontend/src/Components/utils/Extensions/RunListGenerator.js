// runListGenerator.js (backend, CommonJS)

function expandRunList(str) {
  let arr = []
  const partes = str.split(",").map((n) => n.trim())
  partes.forEach((n) => {
    if (n.includes("-")) {
      const [start, end] = n.split("-").map(Number)
      for (let i = start; i <= end; i++) arr.push(i)
    } else {
      arr.push(Number(n))
    }
  })
  return arr
}

function completeSheets(pages, totalPages) {
  const set = new Set(pages)
  for (const p of pages) {
    if (p % 2 === 1) {
      const next = p + 1;
      if ((totalPages === undefined || next <= totalPages) && !set.has(next)) set.add(next)
    } else {
      const prev = p - 1;
      if (prev >= 1 && !set.has(prev)) set.add(prev)
    }
  }
  return [...set].sort((a, b) => a - b)
}

/**
 * splitPartsForJDF(partes, totalPages, esCuerpo)
 *
 * Misma lógica que la versión frontend, pero trabajando sobre los nombres
 * de campo que ya usa el template del backend (nombreParte, paginas)
 * en vez de los del modelo Mongoose (Name, Pages).
 */
function splitPartsForJDF(partesEntrada, totalPages, esCuerpo) {
  if (!totalPages || totalPages <= 0) {
    // Nada de cuerpo (o total no resuelto todavía): no partir nada.
    return partesEntrada.map((p, i) => {
      const runList = [];
      for (let j = 0; j < asPositiveIntLocal(p.paginas); j++) runList.push(j);
      return { ...p, runList, origenIndex: i };
    });
  }

  const partes = partesEntrada.map((p, i) => ({ ...p, _origenIndex: i }));
  const claimedBy = new Array(totalPages).fill(null);
  const cuerpoPartes = partes.filter(esCuerpo);
  const noCuerpoOriginales = partes.filter((p) => !esCuerpo(p));
  const offsetHumano = noCuerpoOriginales.reduce((s, p) => s + asPositiveIntLocal(p.paginas), 0);

  for (const part of cuerpoPartes) {
    if (!part.RunList || part.RunList.trim() === "") continue;
    const completadoBase1 = completeSheets(expandRunList(part.RunList));
    for (const p1 of completadoBase1) {
      const p0 = p1 - 1;
      if (p0 < 0 || p0 >= totalPages) {
        throw new Error(`"${part.nombreParte}": la página ${p1} está fuera del total (1~${totalPages}).`);
      }
      if (claimedBy[p0]) {
        throw new Error(`Conflicto en la página ${p1}: "${claimedBy[p0].nombreParte}" vs "${part.nombreParte}".`);
      }
      claimedBy[p0] = part;
    }
  }

  const remainderParts = cuerpoPartes.filter((p) => !p.RunList || p.RunList.trim() === "");
  for (let pos = 0; pos < totalPages; pos++) {
    if (claimedBy[pos]) continue;
    if (remainderParts.length === 0) {
      throw new Error(`La página ${pos} quedó libre y no hay ninguna parte remanente que la cubra.`);
    }
    claimedBy[pos] = remainderParts[0];
  }

  const runs = [];
  let runStart = 0, runOwner = claimedBy[0];
  for (let pos = 1; pos <= totalPages; pos++) {
    const owner = pos < totalPages ? claimedBy[pos] : null;
    if (owner !== runOwner) {
      runs.push({ owner: runOwner, startAbs: runStart, endAbs: pos - 1 });
      runStart = pos;
      runOwner = owner;
    }
  }

  const usedInOwnFile = new Map();
  const cuerpoSplit = runs.map((run) => {
    const largo = run.endAbs - run.startAbs + 1;
    const offset = usedInOwnFile.get(run.owner) || 0;
    usedInOwnFile.set(run.owner, offset + largo);
    const runListLocal = [];
    for (let i = 0; i < largo; i++) runListLocal.push(offset + i);
    return {
      ...run.owner,
      paginas: largo,
      runList: runListLocal,
      origenIndex: run.owner._origenIndex,
      _rangoHumano: `${run.startAbs + 1 + offsetHumano}-${run.endAbs + 1 + offsetHumano}`,
    };
  });

  const noCuerpo = noCuerpoOriginales.map((p) => {
    const runListLocal = [];
    for (let i = 0; i < asPositiveIntLocal(p.paginas); i++) runListLocal.push(i);
    return { ...p, runList: runListLocal, origenIndex: p._origenIndex, _rangoHumano: `1-${p.paginas}` };
  });

  return [...noCuerpo, ...cuerpoSplit];
}

function asPositiveIntLocal(value) {
  const n = Math.trunc(Number(value));
  return n > 0 ? n : 1;
}

module.exports = { expandRunList, completeSheets, splitPartsForJDF };
