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
from models import PackingRecommendations, ChartRequest, WeatherData


# def get_clothing_recommendation(temperature, unit='metric'):
    # with open('packing_list.json', 'r') as file:
    #     data = json.load(file)
#         categories = data['temperature']

#     if unit not in ['metric', 'imperial']:
#         raise ValueError('Unit must be either "metric" or "imperial"')

#     # Convert the temperature to both Celsius and Fahrenheit
#     if unit == 'metric':
#         celsius_temperature = temperature
#         fahrenheit_temperature = temperature * 9/5 + 32
#     else:
#         celsius_temperature = (temperature - 32) * 5/9
#         fahrenheit_temperature = temperature
        
#     for category in categories:
#         if category['range'][unit][0] <= temperature <= category['range'][unit][1]:
#             return category['clothing'], celsius_temperature, fahrenheit_temperature

#     return None, None, None


# def get_humidity_recommendation(humidity_value):
#     with open('packing_list.json', 'r') as file:
#         data = json.load(file)
#         humidity_data = data['humidity']

#     for entry in humidity_data:
#         if entry['range'][0] <= humidity_value <= entry['range'][1]:
#             return entry['clothing']

#     return None



def get_temperature_recommendation(data, temperature, unit='metric'):
    temperature = float(temperature)  # Convert temperature to float
    categories = data['temperature']

    if unit not in ['metric', 'imperial']:
        raise ValueError('Unit must be either "metric" or "imperial"')

    for category in categories:
        if category['range'][unit][0] <= temperature <= category['range'][unit][1]:
            return category['clothing'], category['range']['metric'], category['range']['imperial']

    return None, None, None

with open('packing_list.json', 'r') as file:
    data = json.load(file)

print(get_temperature_recommendation(data, "45", "metric"))