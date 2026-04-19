import * as React from "react";
import { useContext, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { StyledTooltip } from "../General/TableGrid";
import { AuthContext } from "../context/AuthContext";
import { ReactComponent as Logo } from "../../img/Logo/logo ok-06.svg";

export const pages = [
  {
    text: "Trabajos",
    drop: [
      { text: "Trabajo Nuevo", path: "jobs/add" },
      { text: "Pedidos", path: "jobs" },
      { text: "Cotizaciones", path: "quotations" },
    ],
  },
  {
    text: "Configuración",
    drop: [
      { text: "Costos", path: "configuracion" },
      { text: "Contadores", path: "billing" },
      { text: "Editor de fórmulas", path: "precios/formula" },
    ],
  },
  {
    text: "Recursos",
    drop: [
      { text: "Formatos", path: "formatos" },
      { text: "Impresoras", path: "impresoras" },
      { text: "Materiales", path: "materiales" },
      { text: "Partes de trabajo", path: "JobParts" },
      { text: "Terminaciones", path: "finishers" },
    ],
  },
  {
    text: "Administración",
    drop: [
      { text: "Clientes", path: "empresas" },
      { text: "Membresías", path: "memberships" },
    ],
  },
  {
    text: "Papyrus",
    pro: true,
    drop: [
      { text: "Conexión Papyrus", path: "papyrus" },
      { text: "Estadísticas Papyrus", path: "jobs/dashboard" },
    ],
  },
];

function ResponsiveAppBar(props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);

  const closeTimer = useRef(null);

  const isLogged = context.useLogin;
  const isPro = context.usePlan === "pro";

  const userMenu = isLogged
    ? [
        { text: "Perfil", path: "users/profile" },
        { text: "Cambiar Contraseña", path: "users/ChangePassword" },
        { text: "Mensajes", path: "messages" },
      ]
    : [
        { text: "Ingresar", path: "login" },
        { text: "Registrarse", path: "register" },
      ];

  const go = (path) => {
    navigate("/" + path);
    closeAll();
  };

  const closeAll = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    setMobileAnchor(null);
    setUserAnchor(null);
    setMenuAnchor(null);
    setCurrentMenu(null);
  };

  const openDesktopMenu = (event, page) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    setMenuAnchor(event.currentTarget);
    setCurrentMenu(page);
  };

  const scheduleCloseDesktopMenu = () => {
    closeTimer.current = setTimeout(() => {
      setMenuAnchor(null);
      setCurrentMenu(null);
    }, 180);
  };

  const cancelCloseDesktopMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (path) => location.pathname.startsWith("/" + path);

  return (
    <AppBar
      position="relative"
      sx={{
        "@media print": { display: "none" },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
        {/* MOBILE MENU BUTTON */}
        <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
          <IconButton
            color="inherit"
            onClick={(e) => setMobileAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* LOGO */}
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate("/")}
        >
          <Logo
            style={{
              width: 26,
              height: 26,
              marginRight: 8,
            }}
          />

          <Typography fontWeight={700}>HAMLET</Typography>

          {isLogged && (
            <Typography
              sx={{
                ml: 1,
                opacity: 0.8,
                display: "block",
              }}
            >
              {context.memberships[0]?.tenant.name || ""}
            </Typography>
          )}
        </Button>

        {/* DESKTOP MENUS */}
        <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
          {pages.map((page) => {
            if (page.pro && !isPro) return null;

            return (
              <Button
                key={page.text}
                color="inherit"
                disabled={!isLogged}
                endIcon={<KeyboardArrowDownIcon />}
                onMouseEnter={(e) => openDesktopMenu(e, page)}
                onClick={(e) => openDesktopMenu(e, page)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 1.5,
                  mx: 0.3,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {page.text}
              </Button>
            );
          })}
        </Box>

        {/* DARK MODE */}
        <Box sx={{ display: "flex", flexDirection: "row", mr: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={props.mode === "dark"}
                onChange={props.toogle}
              />
            }
            label="Dark Mode"
            labelPlacement="bottom"
          />

          {/* USER MENU */}
          <StyledTooltip title={context.userLogged?.Name || "Cuenta"}>
            <IconButton onClick={(e) => setUserAnchor(e.currentTarget)}>
              <Avatar />
            </IconButton>
          </StyledTooltip>
        </Box >
        

        {/* DESKTOP DROPDOWN */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={scheduleCloseDesktopMenu}
          transitionDuration={120}
          MenuListProps={{
            onMouseEnter: cancelCloseDesktopMenu,
            onMouseLeave: scheduleCloseDesktopMenu,
          }}
          PaperProps={{
            onMouseEnter: cancelCloseDesktopMenu,
            onMouseLeave: scheduleCloseDesktopMenu,
          }}
        >
          {currentMenu?.drop?.map((item) => (
            <MenuItem
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => go(item.path)}
            >
              {item.text}
            </MenuItem>
          ))}
        </Menu>

        {/* MOBILE MENU */}
        <Menu
          anchorEl={mobileAnchor}
          open={Boolean(mobileAnchor)}
          onClose={closeAll}
        >
          {pages.map((group) => (
            <Box key={group.text}>
              {(!group.pro || isPro) && (
                <>
                  <MenuItem disabled>{group.text}</MenuItem>

                  {group.drop.map((item) => (
                    <MenuItem
                      key={item.path}
                      disabled={!isLogged}
                      onClick={() => go(item.path)}
                      sx={{ pl: 4 }}
                    >
                      {item.text}
                    </MenuItem>
                  ))}

                  <Divider />
                </>
              )}
            </Box>
          ))}
        </Menu>

        {/* USER DROPDOWN */}
        <Menu
          anchorEl={userAnchor}
          open={Boolean(userAnchor)}
          onClose={closeAll}
        >
          {context.userLogged && (
            <MenuItem disabled>
              {context.userLogged.Name} {context.userLogged.LastName}
            </MenuItem>
          )}

          {userMenu.map((item) => (
            <MenuItem key={item.text} onClick={() => go(item.path)}>
              {item.text}
            </MenuItem>
          ))}

          {isLogged && <Divider />}

          {isLogged && (
            <MenuItem
              onClick={() => {
                context.handleLogout();
                closeAll();
              }}
            >
              Cerrar sesión
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;