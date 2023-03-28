const jobs = require('../../models/Jobs')

const jobControl= {}

jobControl.getJobs = async (req,res)=>{{
    const jobList = await jobs.esquema.find()
    res.json(jobList)}}

jobControl.addJob = async (req,res)=>{{
    try {
        const {Nombre, Tipo, Cantidad} = req.body;
        //const Archivos = '/uploads/' + req.file.filename;
        const newJob = new jobs.esquema({Nombre , Tipo, Cantidad});
        await newJob.save();
        res.json({"message": newJob.Nombre + " guardado OK"});
    } catch (e) {
        console.log(e)
    }
 }}

jobControl.getJob = async (req, res)=> {
    console.log(req.params.id)
    res.json({"Message": "trabajo encontrado " + req.params.id})
  }
jobControl.updateJob = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await formatos.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  }
jobControl.deleteJob =  async (req, res)=> {
    const producto =  await job.findByIdAndDelete(req.params.id);
    fsExtra.unlink(path.resolve('./BackEnd/public' + producto.Archivos));
    res.json({"Message": "Trabajo borrado"})
  }

  module.exports = jobControl