import react from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, CardHeader, CardContent, CardActionArea, Grid } from "@mui/material";

import FormMaterial from "../Formulario/FormMaterial";
import tenantsDataForm from "../Formulario/tenantsDataForm";

import { getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner  from "../General/Spinner";

import { AuthContext } from "../context/AuthContext";

const Tenants = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tenants, setTenants] = useState([]);
    const context = useContext(AuthContext);

    useEffect(() => {
        const fetchTenants = async () => {
            try { 
                const data = await getPrivateElements("tenants");
                setTenants(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchTenants();
     }, []);

    if (loading) {
        return <Spinner />;
    }
    if (error) {
        return (<ErrorMessage message={error.response.data.message} title={error.message}/>
        );
    } 
    
    return (
    <Container>
        <Grid container spacing={2}>
            {tenants.map((tenant) => (
                <Grid item xs={12} md={6} key={tenant._id}>
                    <Card>
                        <CardHeader title={tenant.name} />
                        <CardContent>
                            <p><strong>Estado:</strong> {tenant.status}</p>
                            <p><strong>Plan:</strong> {tenant.plan}</p>
                        </CardContent>
                        <CardActionArea href={`/master/edit/${tenant._id}`}>
                            <p style={{ padding: "16px", textAlign: "center", color: "#1976d2" }}>Editar</p>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>

    </Container>
  );
};

export default Tenants;