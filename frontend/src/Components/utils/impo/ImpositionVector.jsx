import React from 'react';

const ImpositionVector = ({ data }) => {
  if (!data || !data.poses) return null;

  // Extraemos dimensiones del pliego
  const { pliegoAncho, pliegoAlto, poses } = data;

  // Definimos un margen para que el dibujo no toque los bordes del SVG
  const margin = 20;
  const viewWidth = pliegoAncho + margin * 2;
  const viewHeight = pliegoAlto + margin * 2;

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: 'auto', zIndex: 1500, minHeight: '300px', minWidth: '300px' }}>
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ccc',
          borderRadius: '4px' 
        }}
      >
        <g transform={`translate(${margin}, ${margin})`}>
          {/* El Pliego (Fondo) */}
          <rect
            x="0"
            y="0"
            width={pliegoAncho}
            height={pliegoAlto}
            fill="white"
            stroke="#999"
            strokeWidth="1"
          />

          {/* Las Poses (Dibujamos cada rectangulito) */}
          {poses.map((pos, index) => (
            <g key={index}>
              <rect
                x={pos.x}
                y={pos.y}
                width={pos.w}
                height={pos.h}
                fill="rgba(33, 150, 243, 0.1)" // Un azul clarito transparente
                stroke="#2196f3"
                strokeWidth="1"
              />
              {/* Texto opcional: número de pose o dimensiones */}
              <text
                x={pos.x + pos.w / 2}
                y={pos.y + pos.h / 2}
                fontSize={Math.min(pos.w, pos.h) / 4}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#1976d2"
              >
                {index + 1}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <small style={{ color: '#666' }}>
          Esquema: {pliegoAncho}x{pliegoAlto}mm - {poses.length} poses
        </small>
      </div>
    </div>
  );
};

export default ImpositionVector;