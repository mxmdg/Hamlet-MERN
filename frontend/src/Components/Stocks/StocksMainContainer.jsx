import Stocks from './Stocks'
import Form from '../Formulario/Form'
import StockDataForm from '../Formulario/StockDataForm'
//import '../../Styles/hamlet.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import { Typography, Button, Grid, Card, CardContent, CardActions, CardHeader } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import AddFloatButton from '../General/AddFloatButton';

const StocksMainContainer = ()=> {
    const collection= 'materiales'
    const navigate = useNavigate()

    return (<Container >
                <Card variant="elevation" elevation={10} raised m={10} sx={{p: "25px"}}>
                  <CardHeader title={collection} />
                  <CardContent>
                    <Stocks collection={collection}/>
                  </CardContent>
                  <CardActions>
                    <AddFloatButton text={"Agregar " + collection} onclick={()=>navigate(`/hamlet/${collection}/add`)}/>
                  </CardActions>    
                </Card>
            </Container>)
}

export default StocksMainContainer