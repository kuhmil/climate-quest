import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Plot from "react-plotly.js";
import continentsCountries from "./locations.json";
import "./App.css";
import paperAirplane from "./paper-airplane.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import CelsiusIcon from "./icons/CelsiusIcon.png"; // adjust the path as necessary
import FahrenheitIcon from "./icons/FahrenheitIcon.png"; // adjust the path as necessary

function App() {
  const [message, setMessage] = useState(null);
  const [continent, setContinent] = useState(
    Object.keys(continentsCountries)[0]
  );
  const [country, setCountry] = useState(
    Object.keys(continentsCountries[continent])[0]
  );
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [precipitationIntensity, setPrecipitationIntensity] = useState(null);
  const [packingList, setPackingList] = useState(null);
  const [activity, setActivity] = useState("");
  const [travelType, setTravelType] = useState("");
  const [selectedClothes, setSelectedClothes] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [missingData, setMissingData] = useState(false); // Add missingData state variable

  <img src={paperAirplane} alt="Paper Airplane" className="paper-airplane" />;

  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (continentsCountries[continent]) {
      setCountry(Object.keys(continentsCountries[continent])[0]);
    }
  }, [continent]);

  useEffect(() => {
    if (
      continentsCountries[continent] &&
      continentsCountries[continent][country]
    ) {
      setCity(continentsCountries[continent][country][0].city);
    }
  }, [country]);

  const handleContinentChange = (e) => {
    setContinent(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleTravelTypeChange = (e) => {
    setTravelType(e.target.value);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setUnit(newUnit);
    }
  };

  const toggleChecklist = (checklistNumber) => {
    const checklist = document.getElementById(`checklist${checklistNumber}`);
    checklist.classList.toggle("show-card");
  };

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:8000/quest", {
        continent,
        country,
        city,
        longitude: continentsCountries[continent][country][0].longitude,
        latitude: continentsCountries[continent][country][0].latitude,
        activity,
        travelType,
        startDate,
        endDate,
        unit,
      });

      if (response.status === 200) {
        setMessage("Button was clicked!");

        // Parse the Plotly JSON
        const chartData = response.data.chart.data;
        const chartLayout = response.data.chart.layout;
        setChart({ data: chartData, layout: chartLayout });

        // Update the weather data from the backend response
        setTemperature(response.data.weather.temperature);
        setHumidity(response.data.weather.humidity);
        setWindSpeed(response.data.weather.windSpeed);
        // setPrecipitationIntensity(response.data.weather.precipitationIntensity);

        // Update the clothing data from the backend response
        setPackingList(response.data.packing_list); // Replace 'clothing' with 'packing_list'


        // Check for missing data
        setMissingData(response.data.weather.missingData);

        setCalendarOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m={2} textAlign="center">
      <FormControl style={{ padding: "0", marginLeft: "20px" }}>
        <FormLabel>Select a continent:</FormLabel>
        <Select value={continent} onChange={handleContinentChange}>
          {Object.keys(continentsCountries).map((cont, i) => (
            <MenuItem key={i} value={cont}>
              {cont}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ padding: "0 10px" }}>
        <FormLabel>Select a country:</FormLabel>
        <Select value={country} onChange={handleCountryChange}>
          {continentsCountries[continent] &&
            Object.keys(continentsCountries[continent]).map((cnt, i) => (
              <MenuItem key={i} value={cnt}>
                {cnt}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Select a city:</FormLabel>
        <Select value={city} onChange={handleCityChange}>
          {continentsCountries[continent] &&
            continentsCountries[continent][country] &&
            continentsCountries[continent][country].map((cty, i) => (
              <MenuItem key={i} value={cty.city}>
                {cty.city}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl style={{ padding: "0 10px" }}>
        <FormLabel>Select an activity:</FormLabel>
        <Select value={activity} onChange={handleActivityChange}>
          <MenuItem value="camping">Camping</MenuItem>
          <MenuItem value="beach">Beach</MenuItem>
          <MenuItem value="hiking">Hiking</MenuItem>
          <MenuItem value="city exploration">City Exploration</MenuItem>
          <MenuItem value="road trip">Road Trip</MenuItem>
          <MenuItem value="skiing/snowboarding">Skiing/Snowboarding</MenuItem>
          <MenuItem value="cruise">Cruise</MenuItem>
          <MenuItem value="wildlife safari">Wildlife Safari</MenuItem>
        </Select>
      </FormControl>

      <FormControl style={{ padding: "0 10px" }}>
        <FormLabel>Select a travel type:</FormLabel>
        <Select value={travelType} onChange={handleTravelTypeChange}>
          <MenuItem value="sightseeing">Sightseeing</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="adventure">Adventure</MenuItem>
          <MenuItem value="leisure">Leisure</MenuItem>
          <MenuItem value="cultural">Cultural</MenuItem>
          <MenuItem value="eco-tourism">Eco-tourism</MenuItem>
          <MenuItem value="backpacking">Backpacking</MenuItem>
          <MenuItem value="educational">Educational</MenuItem>
          <MenuItem value="volunteer">Volunteer</MenuItem>
          <MenuItem value="medical">Medical</MenuItem>
          <MenuItem value="solo">Solo</MenuItem>
        </Select>
      </FormControl>

      <Box
        mt={-10}
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-start"
        mr={5}
      >
        <FormControl className="temperature-control">
          <FormLabel>Unit of Temperature:</FormLabel>
          <Box className="center-box">
            <ToggleButtonGroup
              value={unit}
              exclusive
              onChange={handleUnitChange}
              aria-label="unit of temperature"
            >
              <ToggleButton
                value="metric"
                aria-label="Metric"
                className="toggleButtonC"
              >
                <img
                  src={CelsiusIcon}
                  alt="Celsius Icon"
                  className="toggle-icon-c"
                />
              </ToggleButton>
              <ToggleButton
                value="imperial"
                aria-label="Imperial"
                className="toggleButtonF"
              >
                <img
                  src={FahrenheitIcon}
                  alt="Fahrenheit Icon"
                  className="toggle-icon-f"
                />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </FormControl>
      </Box>

      <img
        src={paperAirplane}
        alt="Paper Airplane"
        style={{
          position: "absolute",
          top: 40,
          right: 200,
          width: "30%",
          height: "20%",
          transform: "rotate(6deg)",
        }}
      />

      <Box mt={5} display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          className="button button-space"
          onClick={handleClick}
        >
          Generate
        </Button>
      </Box>

      <Box
        m={2}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        ml={20}
      >
        <Box flex={1} display="flex" flexDirection="column" alignItems="start">
          {chart && (
            <Box mt={2}>
              <h2>Conditions in {city}</h2>
              {missingData ? (
                <p>
                  There is currently not enough data available for this city.
                </p>
              ) : (
                <>
                  {temperature && (
                    <p>
                      Temperature: {temperature} °
                      {unit === "metric" ? "C" : "F"}
                    </p>
                  )}

                  {humidity && <p>Humidity: {humidity} %</p>}

                  {windSpeed && <p>Wind Speed: {windSpeed} m/s</p>}

                  {precipitationIntensity && (
                    <p>
                      Precipitation Intensity: {precipitationIntensity} mm/hr
                    </p>
                  )}
                </>
              )}
              {
                <Plot
                  data={chart.data}
                  layout={chart.layout}
                  config={{ displayModeBar: false }}
                  useResizeHandler
                  style={{ width: "800px", height: "0px" }}
                />
              }
            </Box>
          )}
        </Box>
        <Box flex={1} display="flex" flexDirection="column" alignItems="start" ml={20}>
          {/* Packing list data */}
          {packingList && (
            <Box mt={2} display="flex" flexDirection="column" alignItems="start">
              <h2>Packing Recommendations</h2>
              {Object.entries(packingList).map(([key, value], i) => (
                <FormControlLabel 
                  key={i}
                  control={
                    <Checkbox 
                      checked={selectedClothes[key] || false}
                      onChange={(e) => setSelectedClothes({...selectedClothes, [key]: e.target.checked})}
                      name={key}
                      color="primary"
                    />
                  }
                  label={`${key}: ${value}`}
                />
              ))}
            </Box>
          )}
   
          <Box position="absolute" top="16px" left="400px">
            <FormControl style={{ marginTop: "0px" }}>
              {/* ... (Previous code remains the same) */}
            </FormControl>
          </Box>
        </Box>
      </Box>
          <Box position="absolute" top="16px" left="400px">
            <FormControl style={{ marginTop: "0px" }}>
              <FormLabel>Select date range:</FormLabel>
              <Box
                mt={3}
                display="flex"
                flexDirection="column"
                alignItems="left"
              >
                <Button
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  style={{
                    padding: "0 20px",
                    marginTop: "-2px",
                    marginBottom: "10px",
                  }}
                >
                  Select Dates
                </Button>
                {calendarOpen && (
                  <DatePicker
                    selected={startDate}
                    onChange={(update) => {
                      setStartDate(update[0]);
                      setEndDate(update[1]);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                )}
              </Box>
            </FormControl>
          </Box>
        </Box>
      // </Box>
  );
}

export default App;
