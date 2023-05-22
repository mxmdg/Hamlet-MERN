import React from 'react'
import ReactTimeAgo from 'react-time-ago'

export default function LastSeen(props) {
  return (
    <div>
      Actualizado: <ReactTimeAgo date={props.date} locale="es-AR"/>
    </div>
  )
}