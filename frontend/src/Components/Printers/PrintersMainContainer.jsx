import Printers from './Printers'
import Form from '../Formulario/Form'
import PrintersDataForm from '../Formulario/PrintersDataForm'
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import { Typography, Button, Grid, Card, CardContent, CardActions, CardHeader } from '@mui/material'
import { useNavigate } from 'react-router-dom';


const PrintersMainContainer = ()=> {
  const collection= 'impresoras'
  const navigate = useNavigate()

    return (
                <Container>
                  <Card variant="elevation" elevation={10} raised m={10} sx={{p: "25px"}}>
                    <CardHeader title={collection} />
                    <CardContent>
                      <Printers collection={collection} />
                    </CardContent>
                    <CardActions>
                      <Button variant="outlined" size="small" color="info" onClick={()=>navigate(`/hamlet/${collection}/add`)}>Agregar {collection}</Button>
                    </CardActions>    
                  </Card>
                </Container>)
}

export default PrintersMainContainer