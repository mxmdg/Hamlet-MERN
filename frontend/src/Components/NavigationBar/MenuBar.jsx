import * as React from "react";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Button,
  Avatar,
  FormControlLabel,
  Switch,
  Divider,
  Paper,
  MenuItem as MuiMenuItem,
  Menu as MuiMenu,
} from "@mui/material";

// Imports exactos según documentación oficial de Base UI
import { Menubar } from "@base-ui/react/menubar";
import { Menu } from "@base-ui/react/menu";

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
      { text: "Troubleshooting", path: "troubles" },
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

function MenuBarComponent(props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);

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
    setMobileAnchor(null);
    setUserAnchor(null);
  };

  const isActive = (path) => location.pathname.startsWith("/" + path);

  return (
    <AppBar position="relative" sx={{ "@media print": { display: "none" } }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 1. IZQUIERDA: BOTÓN MOBILE + LOGO */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <IconButton
              color="inherit"
              onClick={(e) => setMobileAnchor(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate("/")}
          >
            <Logo style={{ width: 26, height: 26, marginRight: 8 }} />
            <Typography fontWeight={700}>HAMLET</Typography>
            {isLogged && (
              <Typography sx={{ ml: 1, opacity: 0.8 }}>
                {context.memberships[0]?.tenant.name || ""}
              </Typography>
            )}
          </Button>
        </Box>

        {/* 2. CENTRO: MENUBAR DE BASE UI (solo Desktop) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexGrow: 1,
            ml: 2,
            justifyContent: "center",
          }}
        >
          <Menubar style={{ display: "flex", padding: 0, margin: 0, gap: 4 }}>
            {pages.map((page) => {
              if (page.pro && !isPro) return null;

              return (
                <Menu.Root key={page.text}>
                  <Menu.Trigger
                    render={
                      <Button
                        color="inherit"
                        disabled={!isLogged}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          px: 1.5,
                          mx: 0.3,
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.08)",
                          },
                        }}
                      />
                    }
                  >
                    {page.text}
                  </Menu.Trigger>

                  <Menu.Portal>
                    <Menu.Positioner sideOffset={8}>
                      <Menu.Popup
                        render={
                          <Paper
                            elevation={8}
                            sx={{ minWidth: 200, py: 1, zIndex: 1500 }}
                          />
                        }
                      >
                        {page.drop?.map((item) => (
                          <Menu.Item
                            key={item.path}
                            onClick={() => go(item.path)}
                            render={
                              <MuiMenuItem selected={isActive(item.path)} />
                            }
                          >
                            {item.text}
                          </Menu.Item>
                        ))}
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              );
            })}
          </Menubar>
        </Box>

        {/* 3. DERECHA: DARK MODE + USUARIO */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            sx={{ mr: 1, display: { xs: "none", sm: "flex" } }}
            control={
              <Switch
                size="small"
                checked={props.mode === "dark"}
                onChange={props.toogle}
              />
            }
            label="Dark"
          />
          <StyledTooltip title={context.userLogged?.Name || "Cuenta"}>
            <IconButton onClick={(e) => setUserAnchor(e.currentTarget)}>
              <Avatar />
            </IconButton>
          </StyledTooltip>
        </Box>

        {/* --- MENÚS MUI TRADICIONALES (Mobile y Usuario) --- */}

        <MuiMenu
          anchorEl={mobileAnchor}
          open={Boolean(mobileAnchor)}
          onClose={() => setMobileAnchor(null)}
        >
          {pages.map((group) => (
            <Box key={group.text}>
              {(!group.pro || isPro) && (
                <>
                  <MuiMenuItem disabled>{group.text}</MuiMenuItem>
                  {group.drop.map((item) => (
                    <MuiMenuItem
                      key={item.path}
                      disabled={!isLogged}
                      onClick={() => go(item.path)}
                      sx={{ pl: 4 }}
                    >
                      {item.text}
                    </MuiMenuItem>
                  ))}
                  <Divider />
                </>
              )}
            </Box>
          ))}
        </MuiMenu>

        <MuiMenu
          anchorEl={userAnchor}
          open={Boolean(userAnchor)}
          onClose={() => setUserAnchor(null)}
        >
          {context.userLogged && (
            <MuiMenuItem disabled>
              {context.userLogged.Name} {context.userLogged.LastName}
            </MuiMenuItem>
          )}
          {userMenu.map((item) => (
            <MuiMenuItem key={item.text} onClick={() => go(item.path)}>
              {item.text}
            </MuiMenuItem>
          ))}
          {isLogged && <Divider />}
          {isLogged && (
            <MuiMenuItem
              onClick={() => {
                context.handleLogout();
                setUserAnchor(null);
              }}
            >
              Cerrar sesión
            </MuiMenuItem>
          )}
        </MuiMenu>
      </Toolbar>
    </AppBar>
  );
}

export default MenuBarComponent;
