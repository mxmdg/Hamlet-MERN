import Menu from "./Menu";
import AppBarResponsive from "./AppBarResponsive";
import MenuBarComponent from "./MenuBar";

const Header = (props) => {
  return (
    <header>
      <MenuBarComponent toogle={props.toogleMode} mode={props.mode} />
    </header>
  );
};

export default Header;
