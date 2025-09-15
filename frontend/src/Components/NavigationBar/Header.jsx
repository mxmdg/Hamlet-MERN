import Menu from "./Menu";
import AppBarResponsive from "./AppBarResponsive";

const Header = (props) => {
  return (
    <header>
      <AppBarResponsive toogle={props.toogleMode} mode={props.mode} />
    </header>
  );
};

export default Header;
