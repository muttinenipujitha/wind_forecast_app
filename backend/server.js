const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()
app.use(cors())



const ACTUAL_API =
"https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH?format=json&limit=2000"

const FORECAST_API =
"https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR?format=json&limit=2000"


function computeForecastSeries(actual, forecast, horizon){

 const result = []

 actual.forEach(actualPoint => {

   const targetTime = new Date(actualPoint.startTime)

   const cutoffTime = new Date(
     targetTime.getTime() - horizon*60*60*1000
   )

   const validForecasts = forecast.filter(f => {

      const forecastTarget = new Date(f.startTime)
      const publishTime = new Date(f.publishTime)

      return (
        forecastTarget.getTime() === targetTime.getTime() &&
        publishTime <= cutoffTime
      )

   })

   if(validForecasts.length === 0) return

   const latestForecast = validForecasts.sort(
     (a,b)=> new Date(b.publishTime) - new Date(a.publishTime)
   )[0]

   result.push({
      startTime: latestForecast.startTime,
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

app.listen(5000,()=>{
 console.log("Backend running on http://localhost:5000")
})