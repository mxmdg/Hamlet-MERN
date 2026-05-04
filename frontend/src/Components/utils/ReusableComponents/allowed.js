// utils/permissions.js

/**
 * Verifica si un rol tiene permiso basado en una lista de permitidos.
 * @param {string} userRole - El rol del usuario actual.
 * @param {string[]} allowedRoles - Array de roles que pueden ver el elemento.
 * @returns {boolean}
 */
export const isAllowed = (userRole, allowedRoles) => {
  // Si la lista incluye "all", cualquiera entra
  if (!allowedRoles || allowedRoles.length === 0)  {
    return true;
  } else if (allowedRoles.includes("all")){
    // Si no hay roles permitidos definidos, se asume que es público
    return true;
  } else if (!userRole) {
    // Si no hay rol de usuario, no se permite el acceso
    return false;
  } 
  // Si el rol del usuario está en la lista de permitidos
  return allowedRoles.includes(userRole);
};