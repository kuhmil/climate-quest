from datetime import datetime, timedelta
import json
from models import PackingRecommendations, ChartRequest, WeatherData

def convert_date(date_str):

    date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ") 
    utc_now = datetime.utcnow() 

    utc_12_hours_ago = utc_now - timedelta(hours=12)
    
    while date >= utc_now or date >= utc_12_hours_ago:
        date -= timedelta(days=365)

    date_time_str = date.isoformat(timespec='seconds') + "Z"  # Note the change here

    return date_time_str

def adjust_dates(request: ChartRequest):
    startDate = convert_date(request.startDate)
    endDate = convert_date(request.endDate)

    startDate_datetime = datetime.strptime(startDate, "%Y-%m-%dT%H:%M:%SZ")
    endDate_datetime = datetime.strptime(endDate, "%Y-%m-%dT%H:%M:%SZ")

    if startDate_datetime == endDate_datetime:
        endDate_datetime += timedelta(days=1)
        
    endDate = endDate_datetime.isoformat(timespec='seconds') + "Z"
    
    return startDate, endDate

def get_iso_code(country_name):
    with open('country_iso_codes.json') as file:
        country_iso_data = json.load(file)

    iso_code = country_iso_data.get(country_name)
    if not iso_code:
        print(f"No ISO code found for {country_name}.")
        return None
    return iso_code


def get_temperature_recommendation(data, temperature, unit='metric'):
    temperature = float(temperature)  # Convert temperature to float
    categories = data['temperature']

    if unit not in ['metric', 'imperial']:
        raise ValueError('Unit must be either "metric" or "imperial"')

    for category in categories:
        if category['range'][unit][0] <= temperature <= category['range'][unit][1]:
            return category['clothing'], category['range']['metric'], category['range']['imperial']

    return None, None, None

def get_humidity_recommendation(data, humidity_value):

    humidity_data = data['humidity']

    for entry in humidity_data:
        if entry['range'][0] <= humidity_value <= entry['range'][1]:
            return entry['clothing'], entry['range']

    return None, None

def get_wind_speed_recommendation(data, wind_speed):
    wind_speed_data = data['windSpeed']

    for entry in wind_speed_data:
        if entry['range'][0] <= wind_speed <= entry['range'][1]:
            return entry['clothing']

    return None

def get_precipitation_recommendation(data, precipitation_intensity):
    precipitation_data = data['precipitationIntensity']

    for entry in precipitation_data:
        if entry['range'][0] <= precipitation_intensity <= entry['range'][1]:
            return entry['clothing']

    return None

def get_general_items_recommendation(data, activity):
    general_items_data = data['generalItems']

    for entry in general_items_data:
        if entry['activity'] == activity:
            return entry['items']

    return None

def get_travel_types_recommendation(data, travel_type):
    travel_types_data = data['travelTypes']

    for entry in travel_types_data:
        if entry['type'] == travel_type:
            return entry['items']

    return None


def get_packing_list(weatherData: WeatherData, activity, travelType, unit) -> PackingRecommendations:
    # temperature = data.averageTemperature
    # humidity = data.averageHumidity
    # windSpeed = data.averageWindSpeed

    print(weatherData)
    print(activity)
    print(travelType)

    with open('packing_list.json', 'r') as file:
        data = json.load(file)


    temperature_clothing, metric, farenheit  = get_temperature_recommendation(data, weatherData.averageTemperature, unit)
    # wind_speed_clothing = get_wind_speed_recommendation(data, weatherData.)
    # # precipitation_clothing = get_precipitation_recommendation(data, precipitation_intensity)
    general_items = get_general_items_recommendation(data, activity)
    travel_type_items = get_travel_types_recommendation(data, travelType)



    return PackingRecommendations(
        clothing_items=temperature_clothing,
        general_items=general_items
        # travel_items=["camille"]
    )