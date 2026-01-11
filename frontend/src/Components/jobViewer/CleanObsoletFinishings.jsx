export const cleanObsoleteFinishings = (job, validFinishers) => {
  if (!job || !Array.isArray(validFinishers)) return job;

  const validIds = new Set(
    validFinishers.map((f) => (typeof f === "object" ? f._id : f))
  );

  let modified = false;

  // 🔹 limpiar finishing del trabajo
  let jobFinishing = job.Finishing;
  if (Array.isArray(jobFinishing)) {
    const cleaned = jobFinishing.filter((id) => validIds.has(id));
    if (cleaned.length !== jobFinishing.length) {
      jobFinishing = cleaned;
      modified = true;
    }
  }

  // 🔹 limpiar finishing de cada parte
  const cleanedParts = job.Partes?.map((part) => {
    if (!Array.isArray(part.Finishing)) return part;

    const cleaned = part.Finishing.filter((id) => validIds.has(id));
    if (cleaned.length !== part.Finishing.length) {
      modified = true;
      return { ...part, Finishing: cleaned };
    }

    return part;
  });

  if (!modified) return job;

  return {
    ...job,
    Finishing: jobFinishing,
    Partes: cleanedParts,
  };
};
