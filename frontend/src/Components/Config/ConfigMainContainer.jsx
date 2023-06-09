import '../../Styles/hamlet.css'
import FormatsMainContainer from '../Formats/FormatsMainContainer'
import StocksMainContainer from '../Stocks/StocksMainContainer'
import PrintersMainContainer from '../Printers/PrintersMainContainer'
import PricesMainContainer from '../Precioso/PricesMainContainer'
import { Divider } from '@mui/material'


const ConfigMainContainer = ()=> {
    return (<ul style={{listStyleType: 'none'}}>
                <li><PricesMainContainer/></li>
                <Divider light={false}/>
                <li><FormatsMainContainer/></li>
                <Divider /> 
                <li><StocksMainContainer/></li>
                <Divider /> 
                <li><PrintersMainContainer/> </li> 
            </ul>)
}

export default ConfigMainContainer