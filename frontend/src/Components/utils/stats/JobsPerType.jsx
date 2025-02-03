import React, { useState, useEffect } from "react";
import NewRadialBar from "./NewRadialBar";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const JobsPerType = (props) => {
    const [useRank, setRank] = useState(6);
    const [useError, setError] = useState(null);
    const [topCustomers, setTopCustomers] = useState([]);

    useEffect(() => {
        let customers = {};

        try {
            for (let job of props.jobs) {
                if (customers[job.Tipo[0].name]) {
                    customers[job.Tipo[0].name].qJobs >= 1
                        ? customers[job.Tipo[0].name].qJobs += 1
                        : customers[job.Tipo[0].name].qJobs = 1;
                } else {
                    customers[job.Tipo[0].name] = { qJobs: 1, name: `${job.Tipo[0].name}` };
                }
            }

            const sortedCustomers = Object.values(customers).sort((a, b) => a.qJobs - b.qJobs).slice(-useRank);
            setTopCustomers(sortedCustomers);
        } catch (error) {
            setError(error);
        }
    }, [props.jobs, useRank]);

    const success = <NewRadialBar data={topCustomers} dataKey="qJobs" />;
    const errorComponent = <ErrorMessage message={"Error recopilando los datos"} action={() => setError(null)} />;

    return useError === null ? success : errorComponent;
};

export default JobsPerType;