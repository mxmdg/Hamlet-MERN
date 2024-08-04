let MoldeEmpresas = [{
    inputName: 'Nombre',
    type: 'Text',
    id: 'id_701'
},
{
    inputName: 'email',
    type: 'email',
    id: 'id_702'
},
{
    inputName: 'Calle',
    type: 'Text',
    id: 'id_703'
},
{
    inputName: 'Ciudad',
    type: 'Text',
    id: 'id_704'
},
{
    inputName: 'Codigo_Postal',
    type: 'Text',
    id: 'id_705'
},
{
    inputName: 'Provincia',
    type: 'Select',
    id: 'id_706',
    options: [
        {text: 'Buenos Aires', value: 'Buenos Aires', id: 'pr01'},
        {text: 'CABA', value: 'CABA', id: 'pr00'}, 
        {text: 'Entre Rios', value: 'Entre Rios', id: 'pr02'}, 
        {text: 'Santa Fe', value: 'Santa Fe', id: 'pr03'}
    ]
},
{
    inputName: 'Pais',
    type: 'Text',
    id: 'id_707'
},
{
    inputName: 'Telefono',
    type: 'Text',
    id: 'id_708'
}
]

export default MoldeEmpresas

/*
'Proceso': {type: String, required: true},
'Valor': {type: Number, required: true},
'Minimo': {type: Number, required: true},
'Entrada': {type: Number, required: false},
'Formula': {type: String, required: true},
'Fecha': {type: Date, default: Date.now, required: false}
*/