import React from "react"
import { getPrivateElements } from "../../customHooks/FetchDataHook"
import ErrorMessage from "../../ErrorMessage/ErrorMessage"
import { CircularProgress } from "@mui/material"

//Importar Calculos
import JobsPerClient from "./JobsPerClient"
import JobsPerSeller from "./JobsPerSeller"
import JobsPerType from "./JobsPerType"

const StatsCollector = ()=>{
    const [jobsList, setJobsList] = React.useState([])
    const [partsList, setPartsList] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    // Manejo de errores
    const [useError, setError] = React.useState(null)
    const clearError = ()=> {
        setError(null)
    }


    React.useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const jobs = await getPrivateElements("jobs/complete");
                const parts = await getPrivateElements("jobs/partes")
                setJobsList(jobs)
                setPartsList(parts)
                setLoading(false)
            } catch (e) {
                console.log(e)
                setError(e)
                setLoading(false)
            }
            
        }
        fetchData()
    },[])

    const isError = <ErrorMessage message={useError} action={clearError}/>

    const isLoading = <CircularProgress />

    const okContent = (
                    <div>
                        <h5>Contenido cargado correctamente</h5>
                        <JobsPerClient jobs={jobsList}/>
                        <JobsPerSeller jobs={jobsList}/>
                        <JobsPerType jobs={jobsList}/>
                    </div>
                    )

    return (loading ? isLoading : useError !== null ? isError : okContent )

}

export default StatsCollector