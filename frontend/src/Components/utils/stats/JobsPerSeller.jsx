import React from "react"
import NewRadialBar from "./NewRadialBar"

const JobsPerSeller = (props)=> {
    // Calcular la cantidad de trabajos por cliente.
    // Recibe la lista de trabajos en props.jobs
    // Se accede a la propiedad company en props.jobs.company
    const [useRank, setRank] = React.useState(10)
    
    let customers = {}

   for (let job of props.jobs) {
        if (customers[job.Owner._id]) {
            customers[job.Owner._id].qJobs >= 1
            ? customers[job.Owner._id].qJobs += 1 
            : customers[job.Owner._id].qJobs = 1 
        } else (
            customers[job.Owner._id] = {qJobs: 1, name: (`${job.Owner.Name} ${job.Owner.LastName}`)}
        )
        
    }

    const topCustomers = (Object.values(customers).sort((a, b) => a.qJobs - b.qJobs).slice(-useRank))

    return <NewRadialBar data={topCustomers} dataKey='qJobs' />

}

export default JobsPerSeller