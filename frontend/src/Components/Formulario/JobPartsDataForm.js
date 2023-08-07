let MoldeJobParts = [{
    inputName: 'Type',
    type: 'Text',
    id: 'id_401'
},
{
    inputName: 'minPages',
    type: 'number',
    step: 1,
    id: 'id_402'
},{
    inputName: 'maxPages',
    type: 'number',
    step: 1,
    id: 'id_403'
},
{
    inputName: 'PrintModAllowed',
    type: 'text',
    id: 'id_404',
    options: [
        {text: 'Simplex', value: 'Simplex'},
        {text: 'Duplex', value: 'Duplex'}
    ]
},
{
    inputName: 'minStockWeight',
    type: 'number',
    id: 'id_405'
},
{
    inputName: 'maxStockWeight',
    type: 'number',
    id: 'id_405'
}
]

export default MoldeJobParts