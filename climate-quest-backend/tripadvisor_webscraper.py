from fastapi import FastAPI
from pydantic import BaseModel
import requests
from main import ChartRequest


@app.post("/packing-recommendations")
def get_packing_recommendations(chart_request: ChartRequest):
    # OpenWeatherMap API credentials
    api_key = 'YOUR_API_KEY'

    # Location information
    city = chart_request.city
    country = chart_request.country

    # Construct the API request URL
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid={api_key}"

    # Send a GET request to the OpenWeatherMap API
    response = requests.get(url)
    weather_data = response.json()

    # Extract the temperature from the weather data
    temperature = weather_data['main']['temp']

    # Determine the clothes and items to bring based on the temperature
    if temperature < 10:
        clothes = 'Warm clothes, jacket, hat, gloves'
    elif temperature < 20:
        clothes = 'Light jacket, long sleeves, jeans'
    else:
        clothes = 'T-shirts, shorts, light clothing'

    # Create a response payload
    response = {
        'temperature': temperature,
        'packing_recommendations': clothes
    }

    return response
