import Printers from './Printers'
import Form from '../Formulario/Form'
import PrintersDataForm from '../Formulario/PrintersDataForm'
import React, { useState } from 'react';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';


import './printers.css'


const PrintersMainContainer = ()=> {
    return (
             <Container>
                <Box>
                    <h3>Impresoras</h3>
                    <Printers collection='impresoras'/>
                    <Form form={PrintersDataForm} collection='impresoras'/>
                </Box>
             </Container>)
}

export default PrintersMainContainer