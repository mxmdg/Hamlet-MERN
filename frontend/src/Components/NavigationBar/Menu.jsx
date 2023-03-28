import {Link } from 'react-router-dom'

const Menu = (props)=> {
    return <nav className="navBar">
                <ul>
                    <li><Link to="/" >Hamlet</Link></li>
                    <li><Link id='jobs' to='/Hamlet/jobs'>Trabajos</Link></li>
                    <li><Link id='impresoras' to='/Hamlet/impresoras'>Impresoras</Link></li>
                    <li><Link id='materiales' to='/Hamlet/materiales'>Materiales</Link></li>      
                </ul>
            </nav>
    
    }         

export default Menu;