import React from "react"
import { useEffect, useState } from "react"
import ForecastChart from "./components/ForecastChart"
import { fetchWindData } from "./services/api"


export default function App(){

 const [actual,setActual] = useState([])
 const [forecast,setForecast] = useState([])
 const [horizon,setHorizon] = useState(4)

 const [metrics,setMetrics] = useState({
  mean:0,
  median:0,
  p99:0
 })

 useEffect(()=>{
  loadData()
 },[horizon])

 const loadData = async ()=>{
  const data = await fetchWindData(horizon)

  const actualData = data.actual
  const forecastData = data.forecast

  setActual(actualData)
  setForecast(forecastData)

  const errors = actualData.map((a,i)=>
   Math.abs(a.generation - (forecastData[i]?.generation || 0))
  )

  const sorted = [...errors].sort((a,b)=>a-b)

  const mean = errors.reduce((a,b)=>a+b,0)/errors.length
  const median = sorted[Math.floor(sorted.length/2)]
  const p99 = sorted[Math.floor(sorted.length*0.99)]

  setMetrics({mean,median,p99})
 }

 return(

 <div className="p-8 bg-gray-100 min-h-screen">

 <h1 className="text-3xl font-bold mb-6">
 Wind Forecast Monitoring Dashboard
 </h1>

 {/* Horizon slider */}

 <div className="bg-white p-4 rounded shadow mb-6">

 <label className="font-semibold">
 Forecast Horizon: {horizon} hours
 </label>

 <input
  type="range"
  min="1"
  max="12"
  value={horizon}
  onChange={(e)=>setHorizon(e.target.value)}
  className="w-full"
 />

 </div>

 {/* Chart */}

 <div className="bg-white p-6 rounded shadow mb-6">

 <ForecastChart actual={actual} forecast={forecast}/>

 </div>

 {/* Metrics */}

 <div className="grid grid-cols-3 gap-4">

 <div className="bg-white p-4 rounded shadow text-center">
 <p className="text-gray-500">Mean Error</p>
 <p className="text-2xl font-bold">{metrics.mean.toFixed(2)} MW</p>
 </div>

 <div className="bg-white p-4 rounded shadow text-center">
 <p className="text-gray-500">Median Error</p>
 <p className="text-2xl font-bold">{metrics.median.toFixed(2)} MW</p>
 </div>

 <div className="bg-white p-4 rounded shadow text-center">
 <p className="text-gray-500">P99 Error</p>
 <p className="text-2xl font-bold">{metrics.p99.toFixed(2)} MW</p>
 </div>

 </div>

 </div>

 )

}