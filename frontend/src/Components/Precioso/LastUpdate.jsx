import React from "react";
import ReactTimeAgo from "react-time-ago";

export default function LastSeen(props) {
  return (
    <>
      Actualizado: <ReactTimeAgo date={Date.parse(props.date)} locale="es-ES" />
    </>
  );
}
