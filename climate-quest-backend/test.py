# from fastapi import FastAPI
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


# app = FastAPI()


# {'location': '43.65107,-79.347015', 'fields': ['temperature', 'humidity', 'windSpeed', 'totalPrecipitationAccumulation'], '
# timesteps': ['1h'], 'startTime': '2022-08-01T23:10:27Z', 'endTime': '2022-08-02T23:10:27Z', 'units': 'metric'}

url = f"https://api.tomorrow.io/v4/historical?apikey={API_KEY}"

# location = f"{request.latitude},{request.longitude}"
# startDate, endDate = adjust_dates(request)

payload = {
    "location": '43.65107,-79.347015',
    "fields": ["temperature", "humidity", "windSpeed", "totalPrecipitationAccumulation"],
    "timesteps": ["1h"],
    "startTime": '2022-08-01T23:10:27Z',
    "endTime": '2022-08-02T23:10:27Z',
    "units": 'metric'
}

headers = {
    "accept": "application/json",
    "content-type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print(data)