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
import backpack from "./icons/Backpack.png";
import electronics from "./icons/Electric.png";
import shirt from "./icons/Shirt.png";
import toiletries from "./icons/Toiletries.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import CelsiusIcon from "./icons/CelsiusIcon.png"; // adjust the path as necessary
import FahrenheitIcon from "./icons/FahrenheitIcon.png"; // adjust the path as necessary
import Switch from "@material-ui/core/Switch";

function App() {
  const [message, setMessage] = useState(null);
  const [continent, setContinent] = useState(
    Object.keys(continentsCountries)[0]
  );
  const [country, setCountry] = useState(
    Object.keys(continentsCountries[continent])[0]
  );
  const [city, setCity] = useState("");
  const [temperatureC, setTemperatureC] = useState(null);
  const [temperatureF, setTemperatureF] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [precipitationIntensity, setPrecipitationIntensity] = useState(null);
  const [activity, setActivity] = useState("");
  const [travelType, setTravelType] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [missingData, setMissingData] = useState(false); // Add missingData state variable

  const [selectedItems, setSelectedItems] = useState({});

  const [packingList, setPackingList] = useState(null);
  const [clothesList, setClothesList] = useState(null);
  const [toiletriesList, setToiletriesList] = useState(null);
  const [electronicsList, setElectronicsList] = useState(null);

  const [isClothesListVisible, setIsClothesListVisible] = useState(false);
  const [isElectronicsListVisible, setIsElectronicsListVisible] =
    useState(false);
  const [isPackingListVisible, setIsPackingListVisible] = useState(false);
  const [isToiletriesListVisible, setIsToiletriesListVisible] = useState(false);

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

  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const toggleChecklist = (checklistNumber) => {
    const checklist = document.getElementById(`checklist${checklistNumber}`);
    checklist.classList.toggle("show-card");
  };

  const handleTogglePackingList = () => {
    setIsPackingListVisible(!isPackingListVisible);
  };

  const handleToggleClothesList = () => {
    setIsClothesListVisible(!isClothesListVisible);
  };

  const handleToggleElectronicsList = () => {
    setIsElectronicsListVisible(!isElectronicsListVisible);
  };

  const handleToggleToiletriesList = (isVisible) => {
    setIsToiletriesListVisible(!isToiletriesListVisible);
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
        const questData = response.data.weather;
        const questItems = response.data.packing_list;
        setChart({ data: chartData, layout: chartLayout });
  
        // Update the weather data from the backend response
        setTemperatureC(questData.temperatureC);
        setTemperatureF(response.data.weather.temperatureF);
        setHumidity(questData.humidity);
        setWindSpeed(response.data.weather.windSpeed);
        // setPrecipitationIntensity(response.data.weather.precipitationIntensity);
  
        // Update the packing data from the backend response
        setClothesList(questItems.clothes_items);
        // setGeneralItemsList(response.data.packing_list.general_items); // you may need to define setGeneralItemsList
        // setToiletriesList(response.data.packing_list.toiletries_items); // assuming you have other lists like this
        // setElectronicsList(response.data.packing_list.electronics_items); // you may need to define these setters
  
        // Check for missing data
        setMissingData(response.data.weather.missingData);
  
        setCalendarOpen(false);
        // setShowSwitch(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const renderList = (list, selectedItems, setSelectedItems, title) => (
    <Box display="flex" flexDirection="column" alignItems="start">
      <h4>{title}</h4>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      ></Box>
      {Object.entries(list).map(([key, value], i) => (
        <FormControlLabel
          key={i}
          control={
            <Checkbox
              checked={selectedItems[key] || false}
              onChange={(e) =>
                setSelectedItems({
                  ...selectedItems,
                  [key]: e.target.checked,
                })
              }
              name={key}
              color="primary"
            />
          }
          label={`${key}: ${value}`}
        />
      ))}
    </Box>
  );


  return (
    <Box m={5} textAlign="center">
      <div className="rectangle"></div>

      <FormControl style={{ marginTop: "0px" }}>
        <FormLabel>Select date range:</FormLabel>
        <Box mt={3} display="flex" flexDirection="column" alignItems="fixed">
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

      <Box display="flex" position="fixed" right={150} top={95}>
        <div class="center" style={{ position: "relative" }}>
          <div
            id="cloud"
            style={{ position: "absolute", top: "20px", right: "-210px" }}
          ></div>
        </div>
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

      <Box mt={8} display="flex" justifyContent="center" alignItems="center">
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
        ml={25}
      >
        <Box flex={1} display="flex" flexDirection="column" alignItems="start">
          {chart && (
            <Box mt={2}>
              <h2>Conditions in {temperatureC}</h2>
              {missingData ? (
                <p>
                  There is currently not enough data available for this city.
                </p>
              ) : (
                <>
                  {temperatureC && temperatureF && (
                    <p>
                      Temperature: {isCelsius ? temperatureC : temperatureF} °
                      {isCelsius ? "C" : "F"}
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

        {chart && (
          <Box
            m={2}
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="start"
          >
            <h2>Packing Recommendation</h2>
            <Box display="flex" flexDirection="row">
              <div
                className="toggle-radio"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                <img
                  src={backpack}
                  alt="backpack"
                  style={{ width: 50, height: 50 }}
                />
                <div style={{ marginTop: 10 }}>
                  <div className="switch">
                    <input
                      type="radio"
                      name="rdo2"
                      id="minus1"
                      checked={!isPackingListVisible}
                    />
                    <label
                      htmlFor="minus1"
                      onClick={() => handleTogglePackingList(false)}
                    >
                      -
                    </label>
                    <input
                      type="radio"
                      name="rdo2"
                      id="plus2"
                      checked={isPackingListVisible}
                    />
                    <label
                      htmlFor="plus2"
                      onClick={() => handleTogglePackingList(true)}
                    >
                      +
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="toggle-radio"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                <img
                  src={toiletries}
                  alt="toiletries"
                  style={{ width: 50, height: 50 }}
                />
                <div style={{ marginTop: 10 }}>
                  <div className="switch">
                    <input
                      type="radio"
                      name="rdo1"
                      id="minus1"
                      checked={!isToiletriesListVisible}
                    />
                    <label
                      htmlFor="minus1"
                      onClick={() => handleToggleToiletriesList(false)}
                    >
                      -
                    </label>
                    <input
                      type="radio"
                      name="rdo1"
                      id="plus1"
                      checked={isToiletriesListVisible}
                    />
                    <label
                      htmlFor="plus1"
                      onClick={() => handleToggleToiletriesList(true)}
                    >
                      +
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="toggle-radio"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                <img
                  src={shirt}
                  alt="clothes"
                  style={{ width: 60, height: 50 }}
                />
                <div style={{ marginTop: 10 }}>
                  <div className="switch">
                    <input
                      type="radio"
                      name="rdo3"
                      id="minus1"
                      checked={!isClothesListVisible}
                    />
                    <label
                      htmlFor="minus1"
                      onClick={() => handleToggleClothesList(false)}
                    >
                      -
                    </label>
                    <input
                      type="radio"
                      name="rdo3"
                      id="plus1"
                      checked={isClothesListVisible}
                    />
                    <label
                      htmlFor="plus1"
                      onClick={() => handleToggleClothesList(true)}
                    >
                      +
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="toggle-radio"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                <img
                  src={electronics}
                  alt="electronics"
                  style={{ width: 50, height: 50 }}
                />
                <div style={{ marginTop: 10 }}>
                  <div className="switch">
                    <input
                      type="radio"
                      name="rdo4"
                      id="minus1"
                      checked={!isElectronicsListVisible}
                    />
                    <label
                      htmlFor="minus1"
                      onClick={() => handleToggleElectronicsList(false)}
                    >
                      -
                    </label>
                    <input
                      type="radio"
                      name="rdo4"
                      id="plus1"
                      checked={isElectronicsListVisible}
                    />
                    <label
                      htmlFor="plus1"
                      onClick={() => handleToggleElectronicsList(true)}
                    >
                      +
                    </label>
                  </div>
                </div>
              </div>
            </Box>
            {isPackingListVisible &&
              packingList &&
              renderList(
                packingList,
                selectedItems,
                setSelectedItems,
                "Essentials List"
              )}
            {isToiletriesListVisible &&
              toiletriesList &&
              renderList(
                toiletriesList,
                selectedItems,
                setSelectedItems,
                "Toiletries List"
              )}
            {isClothesListVisible &&
              clothesList &&
              renderList(
                clothesList,
                selectedItems,
                setSelectedItems,
                "Clothes List"
              )}
            {isElectronicsListVisible &&
              electronicsList &&
              renderList(
                electronicsList,
                selectedItems,
                setSelectedItems,
                "Electronics List"
              )}
          </Box>
        )}
      </Box>

      <Box className="center-box">
        <img
          src={paperAirplane}
          alt="Paper Airplane"
          style={{
            position: "absolute",
            top: 100,
            left: -100,
            width: "25%",
            height: "20%",
            transform: "rotate(80deg)",
          }}
        />
        <img
          src={paperAirplane}
          alt="Paper Airplane"
          style={{
            position: "absolute",
            bottom: 100,
            right: -100,
            width: "25%",
            height: "20%",
            transform: "rotate(250deg)",
          }}
        />
      </Box>
    </Box>
  );
}

export default App;
