export const formNuvera= (valor , minimo , entrada )=> {
    let valorPapyrus = (valor * 100 + '/100')
    const Valor = 1
    const Minimo = minimo + entrada
    const Tiraje = `(${entrada} + (( Pliegos *IF( Colores_Dorso >0,2,1) / if ( Pliego_Largo >  Pliego_Ancho , if( Pliego_Largo > 355/10, 1,16/10), if( Pliego_Ancho > 355/10, 1,16/10)))) * (${valorPapyrus}))`
    const resultado = { valor, Tiraje , "Minimo + Entrada": Minimo , minimo , entrada }
    return resultado
}

export const formIgenColor= (valor , minimo , entrada )=> {
    let valorPapyrus = (valor * 100 + '/100')
    const formula = `(( Pliegos *IF( Colores_Dorso >0,2,1) / if ( Pliego_Largo >  Pliego_Ancho , if( Pliego_Largo > 488/10, 1, 140/100), if( Pliego_Ancho > 488/10, 1, 140/100)))) * (${valorPapyrus})`
    const resultado = { formula , valor , minimo , entrada }
    return resultado
}
    
export const formIgenBN= (valor , minimo , entrada )=> {
    let valorPapyrus = (valor * 100 + '/100')
    const formula = `(( Pliegos *IF( Colores_Dorso >0,2,1) / if ( Pliego_Largo >  Pliego_Ancho , if( Pliego_Largo > 488/10, 1, 125/100), if( Pliego_Ancho > 488/10, 1, 125/100)))) * (${valorPapyrus})`
    const resultado = { formula , valor , minimo , entrada }
    return resultado
}

export const formEncuadernacion= (valor , minimo , entrada )=> {
    const formula = `(${minimo} + (Cab_Cant_Millar * 1000))`
    const resultado = { formula , valor , minimo}
    return resultado
}

export const formLaminado= (valor , minimo , entrada )=> {
    const formula = 'Pliegos * if ( Pliego_Largo >  Pliego_Ancho , if( Pliego_Largo > 520/10, Pliego_Largo * 115/100 , Pliego_Largo) , if( Pliego_Ancho > 520/10, Pliego_Ancho * 115/100 , Pliego_Ancho))'
    const resultado = {formula , "Valor Frente": valor , "Minimo Frente": minimo , "Valor Frente y Dorso": (valor * 2) , "Minimo Frente y Dorso": (minimo / 2) }
    return resultado
}

