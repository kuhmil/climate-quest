# Weather Dashboard

The Weather Dashboard is a web application that provides weather conditions, forecasts, and travel recommendations, including packing lists. It consists of a React-based frontend that interacts with a FastAPI backend to retrieve weather data and other information related to travel plans.

## Frontend

### Features

- Display current weather conditions including temperature, humidity, wind speed, and precipitation intensity.
- Toggle between Celsius and Fahrenheit units.
- Show a message when there is not enough data available for a particular city.
- Utilize various components and libraries for styling and layout.

### Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
The frontend will now be accessible at http://localhost:3000.

Backend
Endpoints
POST /quest
Prepares a quest with weather data, choropleth chart, and packing recommendations. See the detailed request and response examples in the Backend section above.

Environment Variables
API_KEY: Your API key for the weather data provider.
Running the Backend Locally
Navigate to the backend directory:

bash
Copy code
cd backend
Install required Python dependencies:

bash
Copy code
pip install fastapi uvicorn requests python-dotenv
Create a .env file with the necessary environment variables.

Run the FastAPI application:

bash
Copy code
uvicorn main:app --reload
Visit http://127.0.0.1:8000/docs to access the Swagger documentation and test the endpoints.

Testing
Include instructions for running tests if applicable.

Contributing
Provide guidelines on how others can contribute to the project.

License
Include information about the project's license.

vbnet
Copy code

This Markdown file should render correctly in most Markdown viewers, including GitHub's built-in renderer. Feel free to make any adjustments or add more information as necessary!


## Docker Compose

If you prefer to use Docker Compose to run the application, you can follow these instructions:

1. Ensure Docker and Docker Compose are installed on your system.

2. Navigate to the root directory of the project where the `docker-compose.yml` file is located.

3. Build the Docker images for the frontend and backend:
   ```bash
   docker-compose build
Start the containers:
bash
Copy code
docker-compose up
The frontend will now be accessible at http://localhost:3000, and the backend API documentation will be accessible at http://127.0.0.1:8000/docs.

Stopping and Removing Containers
To stop and remove all containers defined in the docker-compose.yml file, run:

bash
Copy code
docker-compose down
Additional Docker Compose Commands
For more information on using Docker Compose, see the official documentation.

css
Copy code

Please adjust the URLs and port numbers according to your specific setup. Make sure to have the correct `docker-compose.yml` file in place, describing how to build and run the frontend and backend services in Docker.