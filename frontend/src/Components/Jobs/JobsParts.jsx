const JobParts = (props)=>{
    const parts = [
        'Tapa',
        'Contratapa',
        'Interior Binder',
        'Interior Cosido',
        'Interior Anillado',
        'Interior Revista',
        'Hojas sueltas',
        'Afiche',
        'Señalador',
        'Tarjeta',
        'Etiqueta',
        'Insert',
        'Diptico',
        'Triptico',
        'Folleto',
        'Cubierta',
        'Guardas']

    const onChangeHandler = (e) => {
        e.preventDefault()
        props.onChange(e.target.value)
    }    
    
    return (
        <>
            <label htmlFor="Parte">Parte</label>
            <select name="jobParts" onChange={onChangeHandler}>
                {parts.map((part)=><option 
                                        value={part} 
                                        id={`${parts.indexOf(part)}_jobPart`} 
                                        key={part}>
                                            {part}
                                    </option>)}
            </select>
        </>
    )
}

export default JobParts