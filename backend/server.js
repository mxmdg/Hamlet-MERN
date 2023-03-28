require('source-map-support').install();
const app = require('./app')
const path = require('path');

//Importar conexion Mongo DB

const dbConnection = require('./dbConnection')

app.get('/', (rej, res)=>{
    res.end("Welcome to node.js server")
})

app.get('/hamlet/formatos', (rej, res)=>{
    res.end('This is formatos')
})

// configurar server (basico)
app.listen(465, ()=> console.log('Server running on port 465'))

// Rutas (Las traje de Hamlet-FS)

app.use("/Hamlet/jobs",require('./routes/jobs'));
app.use("/Hamlet/Impresoras",require('./routes/printers'));
app.use("/Hamlet/formatos",require('./routes/formatos'));
app.use("/Hamlet/materiales",require('./routes/materiales'));

// Static Files

//app.use(express.static(path.join(__dirname, 'public')));
