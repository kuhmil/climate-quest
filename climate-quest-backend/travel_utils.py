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


def get_packing_list(data: WeatherData, activity, travelType) -> PackingRecommendations:
    temperature = data.averageTemperature
    humidity = data.averageHumidity
    windSpeed = data.averageWindSpeed
    # precipitationIntensity= data.averagePrecipitationIntensity


    with open('packing_list.json') as file:
        clothing_data = json.load(file)

    def check_range(value, range):
        return range[0] <= value <= range[1]

    # Determine conditions based on input values
    try:
        temp_condition = next(item for item in clothing_data["temperature"] if check_range(temperature, item["range"]))
    except StopIteration:
        raise ValueError("No matching temperature condition found.")

    try:
        humidity_condition = next(item for item in clothing_data["humidity"] if check_range(humidity, item["range"]))
    except StopIteration:
        raise ValueError("No matching humidity condition found.")

    try:
        wind_condition = next(item for item in clothing_data["windSpeed"] if check_range(windSpeed, item["range"]))
    except StopIteration:
        raise ValueError("No matching wind speed condition found.")

    # try:
    #     precipitation_condition = next(item for item in clothing_data["precipitationIntensity"] if check_range(precipitationIntensity, item["range"]))
    # except StopIteration:
    #     raise ValueError("No matching precipitation intensity condition found.")

    # Generate a clothing list based on conditions
    clothing_list = temp_condition.get("clothing", []) + humidity_condition.get("clothing", []) 
    # + \
    #                 wind_condition.get("clothing", []) + precipitation_condition.get("clothing", [])

    # Get general items based on activity
    general_items = next((item["items"] for item in clothing_data["generalItems"] if item["activity"] == activity), [])

    # Get additional items based on travel type
    travel_type_items = next((item["items"] for item in clothing_data["travelTypes"] if item["type"] == travelType), [])

    return PackingRecommendations(
        clothing_items=clothing_list,
        general_items=general_items,
        travel_type_items=travel_type_items
    )