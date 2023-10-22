const jobs = require('../../models/Jobs');
const users = require('../../models/usersSchema');
const stocks = require('../../models/materiales')

const jobControl= {}

jobControl.getJobs = async (req,res)=>{{
    const queryText = req.query.Q || '';
    const jobList = await jobs.esquema.find({ Nombre : { $regex: queryText, $options: 'i' }})
                    .select('Nombre Cantidad Fecha Entrega Emision Deadline')
    res.json(jobList)}}

jobControl.addJob = async (req,res)=>{{
    try {
        const Nombre = req.body.jobName; 
        const Tipo =  req.body.JobType;
        const Cantidad = req.body.quantity
        const Partes = req.body.Partes;
        const Entrega = req.body.endDate;
        const Owner = req.body.Owner;
        //const Archivos = '/uploads/' + req.file.filename;
        const newJob = new jobs.esquema({Nombre , Tipo, Cantidad, Entrega, Partes, Owner});
        await newJob.save();
        console.log(`Trabajo agregado`)
        res.json({"message": newJob.Nombre + " guardado OK"});
    } catch (e) {
        throw e
    }
 }}

jobControl.getJob = async (req, res)=> {
    try {
      const job = await jobs.esquema.findById(req.params.id)
        .populate({path: "Owner", model: users.esquema, select: 'Name LastName Role email'})
        .populate({path: 'Partes.partStock', model: stocks.esquema})
      res.json(job)
    } catch (e) {
      res.status(404).json({ message: "Trabajo no encontrado: " + e.message })
    }
    
  }
jobControl.updateJob = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await formatos.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  }
jobControl.deleteJob =  async (req, res)=> {
    const producto =  await jobs.esquema.findByIdAndDelete(req.params.id);
    res.json({"Message": "Trabajo borrado"})
  }

  module.exports = jobControl