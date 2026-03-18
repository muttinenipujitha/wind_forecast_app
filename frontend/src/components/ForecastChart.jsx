import React from "react"
import { Line } from "react-chartjs-2"
import {
 Chart as ChartJS,
 LineElement,
 CategoryScale,
 LinearScale,
 PointElement,
 Legend,
 Tooltip
} from "chart.js"



ChartJS.register(
 LineElement,
 CategoryScale,
 LinearScale,
 PointElement,
 Legend,
 Tooltip
)

export default function ForecastChart({actual,forecast}){

 const labels = actual.map(d=>d.startTime)

 const data = {
  labels,
  datasets:[
   {
    label:"Actual Generation",
    data:actual.map(d=>d.generation),
    borderColor:"#2563eb",
    tension:0.3
   },
   {
    label:"Forecast Generation",
    data:forecast.map(d=>d.generation),
    borderColor:"#16a34a",
    tension:0.3
   }
  ]
 }

 return <Line data={data}/>
}