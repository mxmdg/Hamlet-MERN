import '../../Styles/hamlet.css'
import FormatsMainContainer from '../Formats/FormatsMainContainer'
import StocksMainContainer from '../Stocks/StocksMainContainer'
import PrintersMainContainer from '../Printers/PrintersMainContainer'
import PricesMainContainer from '../Precioso/PricesMainContainer'


const ConfigMainContainer = ()=> {
    return (<>
                <PricesMainContainer/>
                <PrintersMainContainer/>
                <StocksMainContainer/>
                <FormatsMainContainer/>  
            </>)
}

export default ConfigMainContainer