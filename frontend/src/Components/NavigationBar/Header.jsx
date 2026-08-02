import MenuBarComponent from "./MenuBar";

// Nota: este archivo importaba también "./Menu" y "./AppBarResponsive" sin
// usarlos en ningún lado — restos de una versión anterior del Header.
// Los saqué. Si en algún momento necesitás volver a AppBarResponsive,
// está en tu historial de git; por ahora MenuBarComponent es el único
// header real que se renderiza.
const Header = () => {
  return (
    <header>
      <MenuBarComponent />
    </header>
  );
};

export default Header;
