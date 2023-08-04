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
    # temperatureC: List[str]
    # temperatureF: List[str]
    toiletry_items: List[str]
    clothing_items: List[str] = []
    packing_items: List[str] = []
    electronic_items: List[str] = []
