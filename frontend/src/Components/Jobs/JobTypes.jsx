const JobTypes = [
  { name: "Libro", max: 356, min: 50, pagMax: 1000, pagMin: 20, id: "jt001" },
  { name: "Revista", max: 320, min: 70, pagMax: 68, pagMin: 4, id: "jt002" },
  {
    name: "Anillado",
    max: 356,
    min: 100,
    pagMax: 1000,
    pagMin: 20,
    id: "jt003",
  },
  {
    name: "Sin Encuadernacion",
    max: 650,
    min: 20,
    pagMax: 999999,
    pagMin: 1,
    id: "jt004",
  },
  {
    name: "Multipagina",
    max: 650,
    min: 20,
    pagMax: 999999,
    pagMin: 1,
    id: "jt005",
  },
  {
    name: "Cosido a Hilo",
    max: 300,
    min: 100,
    pagMax: 1200,
    pagMin: 20,
    id: "jt006",
  },
];

export default JobTypes;
