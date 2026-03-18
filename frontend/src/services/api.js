import axios from "axios"

const API_URL = "https://wind-backend-xw7q.onrender.com/api/wind"

export const fetchWindData = async (horizon)=>{
 const res = await axios.get(`${API_URL}?horizon=${horizon}`)
 return res.data
}

