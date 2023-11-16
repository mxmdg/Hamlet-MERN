import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";

const Menu = (props) => {
  return (
    <nav className="navBar">
      <ul>
        <li>
          <Link to="/">Hamlet</Link>
        </li>
        <li>
          <Link id="trabajps" to="/trabajos">
            Trabajos
          </Link>
        </li>
        <li>
          <Link id="impresoras" to="/impresoras">
            Impresoras
          </Link>
        </li>
        <li>
          <Link id="materiales" to="/materiales">
            Materiales
          </Link>
        </li>
        <li>
          <Link id="formatos" to="/formatos">
            Formatos
          </Link>
        </li>
        <li>
          <Link id="jobParts" to="/jobParts">
            Job Parts
          </Link>
        </li>
        <li>
          <Link id="empresas" to="/empresas">
            Empresas
          </Link>
        </li>
        <li>
          <Link id="Precioso" to="/precios">
            Precioso
          </Link>
        </li>
        <li>
          <DropdownMenu />
        </li>
        <li>
          <Link id="Config" to="/configuracion">
            Configuracion
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
