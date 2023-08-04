# Climate Quest

The Climate Quest application is a web application that provides weather conditions, forecasts, and travel recommendations, including packing lists. It consists of a React-based frontend that interacts with a FastAPI backend to retrieve weather data and other information related to travel plans.

## Frontend

### Features

- Display Current Weather Conditions: Shows temperature, humidity, wind speed, and other weather metrics for a given location.
Toggle Temperature and Wind Speed Units: Users can choose between Celsius and Fahrenheit for temperature, and m/s or mph for wind speed.
- Interactive Charts: Visualization of weather data using Plotly charts.
- Packing Recommendations: Provides packing suggestions based on weather data, categorized into clothing, packing items, toiletry items, and electronic items.
- Date and Location Selection: Includes date pickers and location selection from a predefined list.
- Error Handling: Show a message when there is not enough data available for a particular city.

### Key Functions

- `handleClick`: 
   - Sends a request to the backend to fetch the weather and packing data, parses the response, and updates the component's state.
- `handleUnitChange`: 
   - Allows users to switch between metric and imperial units.
- Various state management functions such as setTemperatureC, setPackingList, and setMissingData to manage different aspects of the application state.

### Libraries and Modules

- React: A JavaScript library for building user interfaces.
- axios: Promise-based HTTP client for making requests.
- @material-ui/core: Material-UI components for a consistent and attractive UI.
- react-plotly.js: A Plotly component for React to create interactive charts.
- react-datepicker: A date picker component for React.
- @material-ui/lab: Additional Material-UI components.

## Backend

### Features

- FastAPI application provides a comprehensive solution for travelers to get weather data, chart information, and packing recommendations based on the given coordinates (latitude and longitude) and other travel-related details.
- Weather details including temperature, humidity, and wind speed
- A packing list categorized into different sections like packing items, toiletry items, clothing items, and electronic items
- Creates a choropleth chart

### Key Functions

- `prepare_quest(request: ChartRequest)`:
   -  Receives a request object and returns a response containing the choropleth chart data, weather information, and a packing list. The packing list is derived based on the weather data and the type of activity and travel mentioned in the request.

- `get_weather_data(request: ChartRequest) -> WeatherData`: 
   - Handles the fetching of weather data for the given location and time range. Sends a request to the https://api.tomorrow.io/v4/historical endpoint with the necessary parameters, extracts temperature, humidity, and windSpeed, and calculates the average for each of them.

### Libraries and Modules

- FastAPI: Web framework for building APIs.
- CORS: Allows requests from all origins.
- Pydantic: Data parsing and validation using Python type hints.
- Plotly: For creating a variety of interactive plots and charts.
- Requests: For making HTTP requests to the weather data API.
- Statistics: Utilized for calculating the mean of weather data.
- dotenv: To manage environment variables, including API keys.


###  Environment Variables
- `API_KEY`: 
   - API key to authenticate requests to the weather data provider.

### Utility Modules
- `travel_utils`: Contains the get_packing_list and adjust_dates functions.
- `models`: Defines the ChartRequest and WeatherData models.
- `choropleth`: Contains the get_choropleth function to generate the choropleth chart.


## Installation

In addition to FastAPI and React, the project also utilizes Poetry for dependency management. Poetry is a tool that helps manage a project's dependencies and packaging, allowing for streamlined installation and consistent execution across different environments. By using Poetry, the project ensures that all required libraries and modules are properly managed, contributing to the overall stability and maintainability of both the frontend and backend components.

Combining FastAPI for backend development, React for the frontend, and Poetry for dependency management, the project delivers a well-structured, efficient, and user-friendly weather dashboard application.

Feel free to modify the description as needed, based on the specific usage of Poetry in your project.

## Frontend


```# Clone the repository
git clone https://github.com/kuhmil/climate-quest.git

# Change into the directory
cd climate-quest-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

- Visit http://localhost:3000 in your browser to see the application.


## Backend


```# Clone the repository if you have not done so already
git clone https://github.com/kuhmil/climate-quest.git

# Change into the directory
cd climate-quest-backend

# Install dependencies with Poetry
poetry install

# Activate the virtual environment
poetry shell

# Run the FastAPI server
uvicorn main:app --reload
```

- The API will be available at http://localhost:8000, and you can access the API documentation at http://localhost:8000/docs.

## Docker

The project also uses Docker Compose to orchestrate containers for both frontend and backend services, enabling them to run in sync. With Docker Compose, multi-container applications are defined and managed through a YAML file, ensuring a consistent environment. In this specific project, two services are defined within the docker-compose.yml file: backend, running on port 8000, and frontend, running on port 3000. Both services have their respective directories and volumes for proper file synchronization.You can utilize this approach if you prefer not to run it locally in two separate folders.


- Backend Service: The backend service is set up to run from the climate-quest-backend directory, exposing port 8000. The Dockerfile within this directory is used for building the container.
- Frontend Service: Similarly, the frontend service is built from the climate-quest-frontend directory, exposing port 3000.

```bash
# Navigate to the directory with your docker-compose.yml file
cd climate-quest

# Build the services
docker-compose build

# Start the services
docker-compose up

# Optionally, run in the background
docker-compose up -d

# Stop the services
docker-compose down

# View logs
docker-compose logs

# Remove all stopped containers
docker system prune -a
```