// Función para obtener la dirección IP local del equipo
function getLocalIPAddress(callback) {
    // Utilizando WebRTC API para obtener la IP local
    const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
  
    pc.onicecandidate = (e) => {
      if (!e.candidate) {
        // No se encontró una dirección IP local válida
        callback(null);
      } else {
        const ipRegex = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
        const ipMatch = e.candidate.candidate.match(ipRegex);
        const localIP = ipMatch ? ipMatch[0] : null;
        callback(localIP);
      }
      // Cerrar la conexión después de obtener la IP
      pc.close();
    };
  
    pc.createOffer().then((sdp) => {
      pc.setLocalDescription(sdp);
    }).catch((error) => {
      // Ocurrió un error al obtener la IP
      callback(null);
    });
  }
  
  // Llamada a la función para obtener la IP local y usarla en tu programa
  let ipLocal;
  getLocalIPAddress((localIP) => {
    if (localIP) {
      // Aquí puedes usar la variable localIP para configurar la dirección de tu base de datos
      // o cualquier otro propósito que necesites
      ipLocal = localIP
      console.log('Dirección IP local:', localIP);
    } else {
      console.log('No se pudo obtener la dirección IP local.');
    }
  });

  export { ipLocal }
  