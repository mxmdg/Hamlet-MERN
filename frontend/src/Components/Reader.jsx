import axios from 'axios'

const Reader = async (props)=> {
    try {
        const res = await axios.get("http://localhost:5000/hamlet/" + props)
        console.log(res.data)
    } catch (err) {
        console.log(err)
    }
    return <h1>{props}</h1>
}

export default Reader