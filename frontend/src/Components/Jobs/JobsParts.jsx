const JobParts = (props)=>{
    const parts = [
        {
            type: 'Tapa',
            pageRange: [1,2],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [170,350],
        },
        {
            type: 'Contratapa',
            pageRange: [1,2],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [170,350],
        },
        {
            type: 'Interior Binder',
            pageRange: [20,1200],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [65,170],
        },
        {
            type: 'Interior Cosido',
            pageRange: [24,1200],
            printModAllowed: ['duplex'],
            stockWeightRange: [65,150],
        },
        {
            type: 'Interior Anillado',
            pageRange: [8,900],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [65,350],
        },
        {
            type: 'Interior Revista',
            pageRange: [4,72],
            printModAllowed: ['duplex'],
            stockWeightRange: [65,300],
        },
        {
            type: 'Hojas sueltas',
            pageRange: [1,1000000],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [65,350],
        },
        {
            type: 'Afiche',
            pageRange: [1,1000],
            printModAllowed: ['simplex'],
            stockWeightRange: [65,350],
        },
        {
            type: 'Señalador',
            pageRange: [1,1000],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [150,350],
        },
        {
            type: 'Tarjeta',
            pageRange: [1,1000],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [150,350],
        },
        {
            type:'Etiqueta',
            pageRange: [1,1000],
            printModAllowed: ['simplex'],
            stockWeightRange: [65,350],
        },
        {
            type:'Insert',
            pageRange: [1,1000],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [65,350],
        },
        {
            type:'Diptico',
            pageRange: [1,1000],
            printModAllowed: ['duplex'],
            stockWeightRange: [65,350],
        },
        {
            type:'Triptico',
            pageRange: [1,1000],
            printModAllowed: ['duplex'],
            stockWeightRange: [65,350],
        },
        {
            type:'Folleto',
            pageRange: [1,1000],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [65,350],
        },
        {
            type:'Cubierta',
            pageRange: [1,1000],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [150,350],
        },
        {
            type:'Guardas',
            pageRange: [1,1000],
            printModAllowed: ['simplex','duplex'],
            stockWeightRange: [150,350],
        }]

    const onChangeHandler = (e) => {
        e.preventDefault()
        props.onChange(e.target.value)
    }    
    
    return (
        <>
            <label htmlFor="Parte">Parte</label>
            <select name="jobParts" onChange={onChangeHandler}>
                {parts.map((part)=><option 
                                        value={[part.type, part.pageRange, part.printModAllowed, part.stockWeightRange]}
                                        id={`${parts.indexOf(part)}_jobPart`} 
                                        key={part.type}>
                                            {part.type}
                                    </option>)}
            </select>
        </>
    )
}

export default JobParts