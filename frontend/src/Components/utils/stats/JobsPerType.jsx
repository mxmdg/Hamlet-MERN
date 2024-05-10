import React from "react"
import NewRadialBar from "./NewRadialBar"

const JobsPerType = (props)=> {
    // Calcular la cantidad de trabajos por cliente.
    // Recibe la lista de trabajos en props.jobs
    // Se accede a la propiedad company en props.jobs.company
    const [useRank, setRank] = React.useState(6)
    
    let customers = {}

   for (let job of props.jobs) {
        if (customers[job.Tipo[0].name]) {
            customers[job.Tipo[0].name].qJobs >= 1
            ? customers[job.Tipo[0].name].qJobs += 1 
            : customers[job.Tipo[0].name].qJobs = 1 
        } else (
            customers[job.Tipo[0].name] = {qJobs: 1, name: (`${job.Tipo[0].name}`)}
        )

        console.log(customers)
    }

    const topCustomers = (Object.values(customers).sort((a, b) => a.qJobs - b.qJobs).slice(-useRank))

    return <NewRadialBar data={topCustomers} dataKey='qJobs' />

}

export default JobsPerType