import Stocks from './Stocks'
import Form from '../Formulario/Form'
import StockDataForm from '../Formulario/StockDataForm'
import '../../Styles/hamlet.css'

const StocksMainContainer = ()=> {
    return (<>
                <div>
                    <Stocks/>
                    <Form form={StockDataForm} collection='materiales'/>   
                </div>
            </>)
}

export default StocksMainContainer