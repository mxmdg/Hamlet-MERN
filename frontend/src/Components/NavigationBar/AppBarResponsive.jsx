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
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import DropdownMenu from "./DropdownMenu";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL, databaseURL } from "../Config/config";
import { ListItemButton, Paper } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LightModeIcon from "@mui/icons-material/LightMode";

const pages = [
  "Jobs",
  "Configuracion",
  "Formatos",
  "Impresoras",
  "JobParts",
  "Materiales",
  "Empresas",
];
const settings = ["Login", "Register", "Users"];

function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const context = useContext(AuthContext);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    console.log(event.currentTarget);
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    console.log(event.currentTarget);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (goTo) => {
    console.log("handleCloseNavMenu ");
    console.log(goTo);
    goTo ? navigate("/" + goTo) : console.log("Me quedo aca");
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (goTo) => {
    console.log("handleCloseUserMenu ");
    console.log(goTo);
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

  const Navigate = useNavigate();

  return (
    <AppBar position="fixed">
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
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu(page);
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 2, display: { xs: "flex", md: "flex" } }}>
            <Button
              startIcon={<LocalLibraryIcon />}
              variant="h5"
              color="primary"
              onClick={() => Navigate("/")}
              /* sx={{
                    mr: 2,
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    textDecoration: "none",
                  }} */
            >
              HAMLET
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                variant="standard"
                key={page}
                color="primary"
                onClick={() => {
                  handleCloseNavMenu(page);
                }}
                sx={{ my: 2, display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <FormControlLabel
              control={
                <Switch
                  color="warning"
                  onChange={() => props.toogle()}
                  size="small"
                ></Switch>
              }
              label="Dark Mode"
            />

            <Tooltip
              title={
                context.userLogged !== null
                  ? context.userLogged.Name
                  : "Registrarse"
              }
            >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={"Nada"} />
              </IconButton>
            </Tooltip>
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
              <MenuItem>
                {context.userLogged && (
                  <Typography textAlign="center">
                    {context.userLogged.Name} {context.userLogged.LastName}
                  </Typography>
                )}
              </MenuItem>
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
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
