let MoldePrecios = [{
    inputName: 'Proceso',
    type: 'Text',
    id: 'id_401'
},
{
    inputName: 'Valor',
    type: 'Number',
    step: 0.0001,
    id: 'id_402'
},
{
    inputName: 'Minimo',
    type: 'Number',
    id: 'id_403'
},
{
    inputName: 'Entrada',
    type: 'Number',
    id: 'id_404'
},
{
    inputName: 'Formula',
    type: 'textarea',
    id: 'id_405'
}
]

export default MoldePrecios

/*
'Proceso': {type: String, required: true},
'Valor': {type: Number, required: true},
'Minimo': {type: Number, required: true},
'Entrada': {type: Number, required: false},
'Formula': {type: String, required: true},
'Fecha': {type: Date, default: Date.now, required: false}
*/