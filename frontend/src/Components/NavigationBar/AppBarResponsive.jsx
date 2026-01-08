import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CustomizedTooltip from "../utils/CustomizedTooltip";
import { StyledTooltip } from "../General/TableGrid";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import DropdownMenu from "./DropdownMenu";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL, databaseURL } from "../Config/config";
import { ListItemButton, Paper } from "@mui/material";
import SessionTimer from "../Users/SessionTimer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ReactComponent as Logo } from "../../img/Logo/logo ok-06.svg";

export const pages = [
  { text: "Pedidos", path: "jobs" },
  { text: "Cotizaciones", path: "quotations" },
  { text: "Costos", path: "configuracion" },
  { text: "Formatos", path: "formatos" },
  { text: "Impresoras", path: "impresoras" },
  { text: "Partes de trabajo", path: "JobParts" },
  { text: "Materiales", path: "materiales" },
  { text: "Clientes", path: "empresas" },
  //{ text: "Usuarios", path: "users" },
  { text: "Membresias", path: "memberships" },
  { text: "Terminacion", path: "finishers" },
];

function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const context = useContext(AuthContext);

  const navigate = useNavigate();

  // Menu del usuario logeado y sin loguear
  // {Texto: "texto a mostrar", path: "ruta a donde me lleva"}
  const settings = [
    { text: "Ingresar", path: "login" },
    { text: "Registrarse", path: "register" },
    //{ text: "usuarios", path: "users" },
  ];
  const userMenu = [
    { text: "Perfil", path: "users/profile" },
    { text: "Cambiar Contraseña", path: "users/ChangePassword" },
    { text: "Trabajo Nuevo", path: "jobs/add" },
    { text: "Contadores", path: "billing" },
    { text: "Editor de formulas", path: "precios/formula" },
    { text: "Mensajes", path: "messages" },
  ];

  const handleOpenNavMenu = (event) => {
    console.log(event.currentTarget);
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    console.log(event.currentTarget);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (goTo) => {
    goTo ? navigate("/" + goTo) : console.log("Me quedo aca");
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (goTo) => {
    goTo ? navigate("/" + goTo) : console.log("Me quedo aca");
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    try {
      if (window.confirm("Quiere cerrar la sesión?")) {
        context.handleLogout();
      }
      handleCloseUserMenu("/");
    } catch (error) {
      console.log(error);
    }
  };

  const dropMenu = context.useLogin ? userMenu : settings;

  const colorList = [
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "error",
  ];

  const Navigate = useNavigate();

  return (
    <AppBar
      color="primary" //{colorList[Math.round(Math.random() * 5)]}
      enableColorOnDark={false}
      position="fixed"
      sx={{ "@media print": { display: "none" } }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="warning"
              //disabled={context.useLogin}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()}
              color="secondary"
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.path}
                  onClick={() => {
                    handleCloseNavMenu(page.path);
                  }}
                  {...(context.useLogin ? "" : { disabled: true })}
                >
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 2,
              display: { xs: "flex", md: "flex" },
            }}
          >
            {/* SVG imported as ReactComponent must be used with an uppercase name */}
            <Button
              onClick={() => Navigate("/")}
              color="primary"
              variant="contained"
              sx={{ p: "px" }}
            >
              <Logo
                role="img"
                aria-label="Hamlet logo"
                style={{
                  width: "25px",
                  height: "25px",
                  display: "block",
                  margin: "5px",
                }}
              />
              <Typography variant="button">
                {context.useLogin
                  ? `HAMLET | ${context.memberships[0].tenant.name}`
                  : "HAMLET"}
              </Typography>
            </Button>

            {/* <Button
              startIcon={<LocalLibraryIcon />}
              variant="h5"
              color="primary"
              onClick={() => Navigate("/")}
               sx={{
                    mr: 2,
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    textDecoration: "none",
                  }} 
            >
              HAMLET
            </Button> */}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                variant="standard"
                key={page.path}
                color="primary"
                onClick={() => {
                  handleCloseNavMenu(page.path);
                }}
                sx={{ my: 2, display: "block" }}
                {...(context.useLogin ? "" : { disabled: true })}
              >
                {page.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <FormControlLabel
              control={
                <Switch
                  color="success"
                  onChange={() => props.toogle()}
                  size="small"
                  defaultChecked={props.mode === "dark" ? true : false}
                ></Switch>
              }
              label="Dark Mode"
            />

            <StyledTooltip
              title={
                context.userLogged !== null
                  ? context.userLogged.Name
                  : "Registrarse"
              }
            >
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                disabled={false}
              >
                <Avatar alt={"Nada"} />
              </IconButton>
            </StyledTooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu()}
            >
              {context.userLogged && (
                <MenuItem>
                  <Typography textAlign="left" color={"primary"}>
                    {context.userLogged.Name} {context.userLogged.LastName}{" "}
                  </Typography>
                </MenuItem>
              )}

              {dropMenu.map((setting) => (
                <MenuItem
                  key={setting.text}
                  onClick={() => handleCloseUserMenu(setting.path)}
                >
                  <Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
              <MenuItem>
                <ListItemButton
                  {...(context.useLogin ? "" : { disabled: true })}
                  key="logout"
                  onClick={handleLogOut}
                >
                  Cerrar Sesion
                </ListItemButton>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
