import react from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, CardHeader, CardContent, CardActionArea, Grid, Typography } from "@mui/material";

import FormMaterial from "../Formulario/FormMaterial";
import tenantsDataForm from "../Formulario/tenantsDataForm";
import membershipsDataForm from "../Formulario/membershipsDataForm";
import MainContainer from "../Pages/MainContainer";

import { getPrivateElements } from "../customHooks/FetchDataHook";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner  from "../General/Spinner";

import { AuthContext } from "../context/AuthContext";

const Tenants = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [users, setUsers] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const context = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getPrivateElements("users");
                setUsers(data);
            } catch (error) {
                setError(error);
            }
        };

        const membershipsData = async () => {
            try {
                const data = await getPrivateElements("master/memberships");
                setMemberships(data);
            }
            catch (error) {
                setError(error);
            }
        };

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
        fetchUsers();
        membershipsData();
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
                            <p><strong>Admins:</strong> {memberships.filter((m) => m.role === "admin" && m.tenant?._id === tenant?._id).length}</p>
                            {memberships.filter(
                                (m) => m.role === "admin" 
                                && m.tenant?._id === tenant?._id
                                && m.userId !== null
                            ).map((membership, index) => (
                                <Typography key={membership._id} variant="body2" color="textSecondary">
                                    {`${index + 1}. ${membership.userId?.Name} ${membership.userId?.LastName} (${membership.userId?.email})`}
                                </Typography>
                            ))}
                        </CardContent>
                        <CardActionArea href={`/master/edit/${tenant._id}`}>
                            <p style={{ padding: "16px", textAlign: "center", color: "#1976d2" }}>Editar</p>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader title="Lista de miembros" />
                    <CardContent>
                        {memberships.length > 0 && (
                            memberships.filter(
                                (m) => m.status === "activo" 
                                && m.userId !== null 
                                && m.tenant !== null)
                                .map((membership, index) => (
                    <Typography key={membership._id} variant="body1" color={membership.role === "admin" ? "warning" : "textSecondary"}>
                        {`${index + 1}. Membresía de ${membership.userId?.Name} ${membership.userId?.LastName}(${membership.userId?.email} - ${membership.role} en ${membership.tenant?.name})`}
                    </Typography>
                )))}
                </CardContent>
                </Card>                
            </Grid>
            {/* <MainContainer  entity={"memberships/Master"} form={membershipsDataForm}/> */}
        </Grid>

    </Container>
  );
};

export default Tenants;