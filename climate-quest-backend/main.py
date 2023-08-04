from fastapi import FastAPI
from pydantic import BaseModel
import json
import plotly.graph_objects as go
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from datetime import datetime, timedelta
import json
import statistics
from travel_utils import get_packing_list,adjust_dates
from models import ChartRequest, WeatherData
from choropleth import get_choropleth
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('API_KEY')


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/quest")
async def prepare_quest(request: ChartRequest):
        
        data = get_weather_data(request)
        
        if data.missingData is True:
            chart_data_serializable = get_choropleth(request, data.averageTemperature, request.unit)
            return {
                "chart": chart_data_serializable,
                "weather": {
                    "temperature": None,
                    "humidity": None,
                    "windSpeed": None,
                    "missingData": True
                },
                "packing_list": None
            }
        
        chart_data_serializable = get_choropleth(request, data.averageTemperature, request.unit)

        packing_recommendations = get_packing_list(data, request.activity, request.travelType, request.unit)

        print(packing_recommendations.clothing_items)

        return {
            "chart": chart_data_serializable,
            "weather": {
                "temperatureC": data.averageTemperature,
                "temperatureF": data.averageTemperature,
                "humidity": data.averageHumidity,
                "windSpeed": data.averageWindSpeed,
                "missingData": False
            },
            "packing_list": {
                    "packing_items":  packing_recommendations.packing_items,
                    "toiletry_items":  packing_recommendations.toiletry_items,
                    "clothing_items":  packing_recommendations.clothing_items,
                    "electronic_items":  packing_recommendations.electronic_items
                  }
        }


def get_weather_data(request: ChartRequest) -> WeatherData:

    url = f"https://api.tomorrow.io/v4/historical?apikey={API_KEY}"

    location = f"{request.latitude},{request.longitude}"
    startDate, endDate = adjust_dates(request)

    
    payload = {
        "location": location,
        "fields": ["temperature", "humidity", "windSpeed", "totalPrecipitationAccumulation"],
        "timesteps": ["1h"],
        "startTime": startDate,
        "endTime": endDate,
        "units": request.unit
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)


    if response.status_code == 200:
        try:
            data = response.json()



            # Extract temperature, humidity, and windSpeed data from the API response
            temperature = [item['values']['temperature'] for item in data["data"]["timelines"][0]["intervals"]]
            humidity = [item['values']['humidity'] for item in data["data"]["timelines"][0]["intervals"]]
            windSpeed = [item['values']['windSpeed'] for item in data["data"]["timelines"][0]["intervals"]]

            # Calculate the average temperature, humidity, and wind speed
            avg_temperature = round(statistics.mean(temperature), 2)
            avg_humidity = round(statistics.mean(humidity), 2)
            avg_wind_speed = round(statistics.mean(windSpeed), 2)

            print(avg_temperature, avg_humidity,avg_wind_speed )

            # Return the WeatherData object with the calculated averages and missingData set to False
            return WeatherData(
                averageTemperature=avg_temperature,
                averageHumidity=avg_humidity,
                averageWindSpeed=avg_wind_speed,
                missingData=False
            )

        except KeyError:
            # If the required data is missing, return the WeatherData object with missingData set to True
            return WeatherData(
                averageTemperature=0.0,
                averageHumidity=0.0,
                averageWindSpeed=0.0,
                missingData=True
            )

        except Exception as e:
            # Handle any other exceptions that might occur during JSON parsing or calculations
            print(f"An error occurred: {e}")
            return WeatherData(
                averageTemperature=0.0,
                averageHumidity=0.0,
                averageWindSpeed=0.0,
                missingData=True
            )

    else:
        # Handle the case where the API response status code is not 200
        print(f"API request failed with status code: {response.status_code}")
        return None

