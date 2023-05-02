import {Link } from 'react-router-dom'


const Menu = (props)=> {
    return <nav className="navBar">
                <ul>
                    <li><Link to="/" >Hamlet</Link></li>
                    <li><Link id='trabajps' to='/Hamlet/trabajos'>Trabajos</Link></li>
                    <li><Link id='impresoras' to='/Hamlet/impresoras'>Impresoras</Link></li>
                    <li><Link id='materiales' to='/Hamlet/materiales'>Materiales</Link></li>
                    <li><Link id='formatos' to='/Hamlet/formatos'>Formatos</Link></li>
                    <li><Link id='Precioso' to='/Hamlet/precios'>Precioso</Link></li>
                    <li><Link id='Config' to='/hamlet/configuracion'>Configuracion</Link></li>      
                </ul>
            </nav>
    
    }         

export default Menu;
