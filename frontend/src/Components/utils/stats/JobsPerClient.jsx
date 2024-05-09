import React from "react"
import NewRadialBar from "./NewRadialBar"

import { Container } from "@mui/material"

const JobsPerClient = (props)=> {
    // Calcular la cantidad de trabajos por cliente.
    // Recibe la lista de trabajos en props.jobs
    // Se accede a la propiedad company en props.jobs.company
    const [useRank, setRank] = React.useState(5)
    
    let customers = {}

   for (let job of props.jobs) {
        if (customers[job.Company._id]) {
            customers[job.Company._id].qJobs >= 1
            ? customers[job.Company._id].qJobs += 1 
            : customers[job.Company._id].qJobs = 1 
        } else (
            customers[job.Company._id] = {qJobs: 1, name: job.Company.Nombre}
        )
        
    }

    const topCustomers = (Object.values(customers).sort((a, b) => a.qJobs - b.qJobs).slice(-useRank).reverse())

    return <Container sx={{width: "100%", height: '100%'}} >
                <span color="#777">Top {useRank} clientes</span>
                <NewRadialBar data={topCustomers} dataKey='qJobs' />
            </Container>

}

export default JobsPerClient