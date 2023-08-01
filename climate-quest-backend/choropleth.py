import json
import plotly.graph_objects as go
from travel_utils import get_iso_code
from models import ChartRequest
from typing import Dict


def get_choropleth(request: ChartRequest, temperature: float):
    iso_code = get_iso_code(request.country)

    colorscale = get_colorscale(temperature)

    if iso_code:
    #     temperature_bar = go.Bar(
    #         x=["Temperature"],
    #         y=[temperature],
    #         marker=dict(color="orange"),
    #         name="Temperature",
    # )

        fig = go.Figure()
        fig.add_trace(go.Scattergeo(
            lon=[request.longitude],
            lat=[request.latitude],
            mode='markers',
            marker=dict(
                size=12,
                opacity=0.8,
            ),
            text=[request.city]
        ))
        

        fig.add_trace(go.Choropleth(
            locations=[iso_code],
            z=[1],
            colorscale=colorscale,
            autocolorscale=False,
            showscale=False,
            geo='geo'
        ))

        # fig.add_trace(temperature_bar)

        fig.update_layout(
            title=dict(
                text=request.city,
                x=0.5,
                xanchor='center',
                yanchor='top',
                pad=dict(b=1),
                font=dict(
                    size=24,
                    color='rgb(107, 107, 107)',
                    family='Courier New, monospace'
                )
            ),
            geo=dict(
                scope='world',
                landcolor='rgb(217, 217, 217)',
                showland=True,
                showcountries=True,
                countrycolor='rgb(255, 255, 255)',
                projection_type='orthographic',
                bgcolor='rgb(234, 221, 202)'  # Set the background color for the map
            ),
            width=800,
            height=600,
            plot_bgcolor='rgb(234, 221, 202)',
            paper_bgcolor='rgb(234, 221, 202)'
        )

        chart_data = {
            "data": fig.data,
            "layout": fig.layout
        }

        chart_data_serializable = {
            "data": [trace.to_plotly_json() for trace in chart_data["data"]],
            "layout": chart_data["layout"].to_plotly_json()
        }

        return chart_data_serializable

    else:
        print(f"No ISO code found for {request.country}.")

def get_colorscale(number):
    with open('packing_list.json') as file:
        data = json.load(file)

    for entry in data['temperature']:
        if len(entry['range']) == 2:
            if entry['range'][0] <= number <= entry['range'][1]:
                return entry['colorscale']
        else:
            if entry['range'][0] == number:
                return entry['colorscale']
    
    return None

