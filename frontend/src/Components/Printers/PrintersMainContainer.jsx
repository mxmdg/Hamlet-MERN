import Printers from './Printers'
import Form from '../Formulario/Form'
import PrintersDataForm from '../Formulario/PrintersDataForm'
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import { Typography } from '@mui/material'



const PrintersMainContainer = ()=> {
    return (
             <Container>
                    <Typography
          gutterBottom
          variant="h6"
          color="secondary"
          fontWeight={600}
          component="div"
        >
          Impresoras
        </Typography>
                    <Printers collection='impresoras'/>
                    <Form form={PrintersDataForm} collection='impresoras' task="new"/>
             </Container>)
}

export default PrintersMainContainer