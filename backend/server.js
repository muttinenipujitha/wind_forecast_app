const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

app.use(cors({
  origin: "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type"]
}))

const ACTUAL_API =
"https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH?format=json&limit=2000"

const FORECAST_API =
"https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR?format=json&limit=2000"


function computeForecastSeries(actual, forecast, horizon){

 const result = []

 actual.forEach(actualPoint => {

   const targetTime = new Date(actualPoint.startTime)

   const cutoffTime = new Date(
     targetTime.getTime() - horizon * 60 * 60 * 1000
   )

   // STEP 1: loose matching
   const sameTimeForecasts = forecast.filter(f => {
     const forecastTarget = new Date(f.startTime)
     return Math.abs(forecastTarget - targetTime) < 30 * 60 * 1000
   })

   if(sameTimeForecasts.length === 0) return

   // STEP 2: try strict horizon filter
   let validForecasts = sameTimeForecasts.filter(f => {
     const publishTime = new Date(f.publishTime)
     return publishTime <= cutoffTime
   })

   // 🔥 STEP 3: fallback if empty
   if(validForecasts.length === 0){
     validForecasts = sameTimeForecasts
   }

   // STEP 4: pick latest forecast
   const latestForecast = validForecasts.reduce((latest, current)=>{
     return new Date(current.publishTime) > new Date(latest.publishTime)
       ? current
       : latest
   })

   result.push({
      startTime: actualPoint.startTime,
      generation: latestForecast.generation
   })

 })

 return result
}

app.get("/api/wind", async (req,res)=>{

 const horizon = parseInt(req.query.horizon || "4")

 try{

   console.log("Fetching BMRS data...")

   const actualRes = await axios.get(ACTUAL_API)
   const forecastRes = await axios.get(FORECAST_API)

   const actualData = actualRes.data?.data || []
   const forecastData = forecastRes.data?.data || []

   const actualWind = actualData.filter(
      d => d.fuelType === "WIND"
   )

   const forecastSeries = computeForecastSeries(
      actualWind,
      forecastData,
      horizon
   )

   console.log("Actual count:", actualWind.length)
   console.log("Forecast count:", forecastSeries.length)

   res.json({
      actual: actualWind.slice(0,120),
      forecast: forecastSeries.slice(0,120)
   })

 }
 catch(error){

   console.error("Backend error:", error.message)

   res.status(500).json({
      error:"Failed to fetch wind data"
   })

 }

})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`Backend running on ${PORT}`)
})

