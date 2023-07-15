let PrintersDataForm = [{
    inputName: 'Modelo',
    type: 'Text',
    id: 'id_001'
},
{
    inputName: 'Fabricante',
    type: 'Text',
    id: 'id_002'
},
{
    inputName: 'Colores',
    type: 'Text',
    id: 'id_003',
    options: [
        {text: 'CMYK', value: 4},
        {text: 'B&N', value: 1}
    ]
},
{
    inputName: 'X_Minimo',
    type: 'Number',
    id: 'id_004'
},
{
    inputName: 'X_Maximo',
    type: 'Number',
    id: 'id_005'
},
{
    inputName: 'Y_Minimo',
    type: 'Number',
    id: 'id_006'
},
{
    inputName: 'Y_Maximo',
    type: 'Number',
    id: 'id_007'
},
{
    inputName: 'Paginas_por_minuto',
    type: 'Number',
    id: 'id_008'
},
{
    inputName: 'Costo_impresion',
    type: 'Number',
    id: 'id_009'
}
]



export default PrintersDataForm