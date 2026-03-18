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

export default function ForecastChart({ actual, forecast }) {

 // ✅ Create forecast map
 const forecastMap = {}

 forecast.forEach(f => {
  forecastMap[f.startTime] = f.generation
 })

 // ✅ Labels (x-axis)
 const labels = actual.map(d => d.startTime)

 // ✅ Actual data
 const actualData = actual.map(d => d.generation)

 // ✅ FIX: Fill missing forecast values using nearest available
 const forecastData = actual.map((d, i) => {

  if (forecastMap[d.startTime] !== undefined) {
    return forecastMap[d.startTime]
  }

  // 🔥 fallback: use previous forecast value (forward fill)
  for (let j = i - 1; j >= 0; j--) {
    const prevTime = actual[j].startTime
    if (forecastMap[prevTime] !== undefined) {
      return forecastMap[prevTime]
    }
  }

  // fallback if nothing found
  return null
 })

 const data = {
  labels,
  datasets: [
   {
    label: "Actual Generation",
    data: actualData,
    borderColor: "#2563eb",
    tension: 0.3,
    pointRadius: 2
   },
   {
    label: "Forecast Generation",
    data: forecastData,
    borderColor: "#16a34a",
    tension: 0.3,
    spanGaps: true,     // ✅ connects gaps
    showLine: true,     // ✅ force line rendering
    pointRadius: 3
   }
  ]
 }

 const options = {
  responsive: true,
  plugins: {
   legend: { position: "top" },
   title: {
    display: true,
    text: "Actual vs Forecast Wind Generation"
   }
  },
  scales: {
   x: {
    ticks: {
     maxRotation: 45,
     minRotation: 45
    }
   }
  }
 }

 return <Line data={data} options={options} />
}