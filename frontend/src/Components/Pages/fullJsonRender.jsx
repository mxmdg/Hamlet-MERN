import React from 'react';
import CopyToClipboardWrapper from '../General/CopyToClipboardWrapper';

/**
 * Componente que renderiza cualquier objeto JSON como texto formateado.
 * @param {Object} props
 * @param {any} props.data - El objeto JSON a renderizar
 */

const FullJsonRender = ({ data }) => {
  const jsonString = JSON.stringify(data, null, 2);
  return (
    <CopyToClipboardWrapper text={jsonString}>
      <pre style={{
        background: '#222',
        color: '#fff',
        padding: '1em',
        borderRadius: '8px',
        fontSize: '1em',
        overflowX: 'auto',
        maxHeight: '70vh',
        margin: 0,
      }}>
        {jsonString}
      </pre>
    </CopyToClipboardWrapper>
  );
};

export default FullJsonRender;
