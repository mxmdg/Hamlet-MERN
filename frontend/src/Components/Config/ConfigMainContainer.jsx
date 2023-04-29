import '../../Styles/hamlet.css'
import FormatsMainContainer from '../Formats/FormatsMainContainer'
import StocksMainContainer from '../Stocks/StocksMainContainer'
import PrintersMainContainer from '../Printers/PrintersMainContainer'
import PricesMainContainer from '../Precioso/PricesMainContainer'
import Box from '@mui/material/Box'


const ConfigMainContainer = ()=> {
    return (<Box>
                <PricesMainContainer/>
                <PrintersMainContainer/>
                <StocksMainContainer/>
                <FormatsMainContainer/>  
            </Box>)
}

export default ConfigMainContainer