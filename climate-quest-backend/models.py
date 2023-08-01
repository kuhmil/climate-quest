from pydantic import BaseModel
from typing import List


class ChartRequest(BaseModel):
    continent: str
    country: str
    city: str
    longitude: float
    latitude: float
    activity: str
    travelType: str
    startDate: str
    endDate: str
    unit: str


class WeatherData(BaseModel):
    averageTemperature: float
    averageHumidity: float
    averageWindSpeed: float
    missingData: bool


class PackingRecommendations(BaseModel):
    clothing_items: List[str]
    general_items: List[str]
    travel_type_items: List[str]
