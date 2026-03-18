
import axios from "axios"

export const fetchWindData = async (horizon)=>{
 const res = await axios.get(`http://localhost:5000/api/wind?horizon=${horizon}`)
 return res.data
}
