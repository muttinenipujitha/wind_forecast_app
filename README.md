# Wind Forecast Monitoring App

## Overview

This project is a full-stack application to monitor the accuracy of wind power generation forecasts in the United Kingdom.

It compares actual wind generation with forecasted values and provides insights into forecast accuracy.

---

## Tech Stack

**Frontend**

* React (Vite)
* TailwindCSS
* Chart.js

**Backend**

* Node.js
* Express.js
* Axios

**Analysis**

* Python
* Pandas, Matplotlib, Seaborn

---

## Features

* 📊 Actual vs Forecast visualization
* 🎚 Forecast horizon selection (slider)
* 📈 Error metrics (Mean, Median, P99)
* 📉 Forecast error vs horizon analysis
* 📊 Wind generation trend analysis
* ⚡ Reliable wind capacity estimation

---

## Forecast Logic

For each target time:

1. Select forecasts where `startTime = targetTime`
2. Filter forecasts where
   `publishTime <= targetTime - horizon`
3. Choose the **latest available forecast**

This ensures only valid forecasts are used for evaluation.

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
node server.js
```

Server runs at:

```
http://localhost:5000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Analysis

```bash
cd analysis
jupyter notebook
```

Run:

```
wind_forecast_senior_level_analysis.ipynb
```

---

## Key Insights

* Forecast error increases with forecast horizon
* Short-term forecasts are more reliable
* Wind generation is highly variable due to weather

---

## Reliable Wind Capacity

Using historical data, the **10th percentile** of wind generation is used:

> Represents generation available 90% of the time

This provides a conservative estimate of wind power contribution.

---

## Deployment

* Frontend: Vercel
* Backend: Render / Railway

---

## Live Demo

 * Frontend: https://windforecast.vercel.app/ 
 * Backend API: https://wind-backend-xw7q.onrender.com/api/wind?horizon=4

## AI Usage Disclosure

AI tools were used for:

* Debugging API integration
* Structuring frontend components
* Minor code assistance

All analysis, reasoning, and conclusions were developed independently.



## Repository Structure

```
wind-forecast-app
 ├ backend
 ├ frontend
 ├ analysis
 └ README.md
```
