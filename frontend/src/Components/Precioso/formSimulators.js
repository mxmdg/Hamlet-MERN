class formSim {
    constructor() {

    }

    Encuadernacion ( valor , minimo , cantidad) {
        let resultado = valor * (minimo + cantidad)
        let valorUnitario = resultado / cantidad
        return { "Unitario": valorUnitario , "Cantidad": cantidad , "Total": resultado }
    }

    Laminado ( valor , minimo , cantidad , largoPliego , duplex ) {
        let resultado = valor * (cantidad * ((largoPliego > 520)?largoPliego * 1.15:largoPliego))
        resultado = (resultado < minimo)?minimo:resultado
        let valorUnitario = resultado / cantidad
        return { "Unitario": valorUnitario , "Cantidad": cantidad , "Total": resultado }
    }

    Nuvera ( valor , minimo , cantidad , entrada , largoPliego ) {
        let resultado  = entrada + (cantidad/((largoPliego>355)?1:1.6)) * valor
        resultado = (resultado < minimo)?minimo:resultado
        
        let valorUnitario = resultado / cantidad
        return { "Unitario": valorUnitario , "Cantidad": cantidad , "Total": resultado }
    }

    iGEnBN ( valor , minimo , cantidad , entrada , largoPliego ) {
        let resultado  = entrada + (cantidad*((largoPliego>488)?1:(1.25))) * valor
        resultado = (resultado < minimo)?minimo:resultado
        
        let valorUnitario = resultado / cantidad
        return { "Unitario": valorUnitario , "Cantidad": cantidad , "Total": resultado }
    }
}

export default formSim