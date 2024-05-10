import React from "react"
import { NewSimpleLineChart } from "./NewSimpleLineChart"

const JobsPerDate = (props)=> {
    // Calcular la cantidad de trabajos por cliente.
    // Recibe la lista de trabajos en props.jobs
    
    const [useRank, setRank] = React.useState(6)

    const getMyDate = (event)=> {
        const dd = (new Date(event).getUTCDate());
        const mm = (new Date(event).getUTCMonth());
        const yy = (new Date(event).getFullYear());
    
        const MiDate = `${dd}/${mm+1}/${yy}`
        const MiMont = (`${mm + 1}/${yy}`).toString()
    
        return {ddmmyy: MiDate, mmyy: MiMont} 
    
    }
    
    let inDate = {}


   for (let job of props.jobs) {
        const Entrada = getMyDate(job.Fecha).mmyy
        const Salida = getMyDate(job.Entrega).mmyy
        if (inDate[Entrada]) {
            inDate[Entrada].inJobs >= 1
            ? inDate[Entrada].inJobs += 1 
            : inDate[Entrada].inJobs = 1 
        } else (
            inDate[Entrada] = {inJobs: 1, name: (`${Entrada}`)}
        )

        if (inDate[Salida]) {
            inDate[Salida].outJobs >= 1
            ? inDate[Salida].outJobs += 1 
            : inDate[Salida].outJobs = 1 
        } else (
            inDate[Salida] = {outJobs: 1, name: (`${Salida}`)}
        )
    }

    const jobsPerInDate = (Object.values(inDate).sort((a, b) => {
        const dateA = new Date("01/" + a.name).getTime();
        const dateB = new Date("01/" + b.name).getTime();
        return dateA - dateB;
    }))

    return <NewSimpleLineChart data={jobsPerInDate} dataKey={['name','inJobs', 'outJobs']} />

}

export default JobsPerDate