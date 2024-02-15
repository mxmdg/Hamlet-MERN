import React from "react";
import { Box , Typography, Container } from "@mui/material/"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { serverURL, databaseURL } from "../Config/config";
import MainContainer from "../General/MainContainer"

export const Profile = ()=> {
    
    //User Profile
    const context = useContext(AuthContext);

    return (
            <Container>
                <Box>
                    <Typography>
                        Correo electronico: {context.userLogged.email}
                    </Typography>
                    <br></br>
                    <Typography>Rol: {context.userLogged.Role}</Typography>
                    <br></br>
                </Box>
                <MainContainer entity= {`jobs/owner/${context.userLogged._id}`}/>
            </Container>
            
    )
}