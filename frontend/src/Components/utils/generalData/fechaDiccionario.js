const diccionarioFechas = (cadena)=> {
    switch (cadena) {
      case "en 1 día": 
        return "Mañana"
        break;
      case "hace 1 día": 
        return "Ayer"
        break;
      default:
        if (cadena.includes("hora") || cadena.includes("minuto") || cadena.includes("segundo")) {
          return "Hoy"
        } else {
          return cadena
        }
        break;
    }
  }

  export default diccionarioFechas