import Printers from './Printers'
import Form from '../Formulario/Form'
import PrintersDataForm from '../Formulario/PrintersDataForm'
import React, { useState } from 'react';

import './printers.css'


const PrintersMainContainer = ()=> {
    return (
             <>
             <div>
                <h3>Impresoras</h3>
                <Printers collection='impresoras'/>
                <Form form={PrintersDataForm} collection='impresoras'/>
            </div>
            
             </>)
}

export default PrintersMainContainer