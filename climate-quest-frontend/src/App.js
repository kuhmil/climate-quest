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
import electric from "./icons/Electric.png";
import shirt from "./icons/Shirt.png";
import toiletries from "./icons/Toiletries.png";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
// import CelsiusIcon from "./icons/CelsiusIcon.png"; // adjust the path as necessary
// import FahrenheitIcon from "./icons/FahrenheitIcon.png"; // adjust the path as necessary
// import Switch from "@material-ui/core/Switch";

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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [missingData, setMissingData] = useState(false); // Add missingData state variable
  const [showPackingList, setShowPackingList] = useState(false);
  const [selectedClothes, setSelectedClothes] = useState({});
  const [generated, setGenerated] = useState(false);

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

  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setUnit(newUnit);
    }
  };

  const handleToggle = () => {
    setShowPackingList(!showPackingList);
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
        // setPackingList(response.data.packing_list.clothes); // Replace 'clothing' with 'packing_list'

        // Check for missing data
        setMissingData(response.data.weather.missingData);

        setPackingList(response.data.packing_list.clothes); // Replace 'clothing' with 'packing_list'
        setGenerated(true);

        setCalendarOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        <div className="toggle-radio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
          <img src={backpack} style={{ width: 50, height: 50 }} />
          <div style={{ marginTop: 10 }}>
            <input type="radio" name="rdo" id="minus1" defaultChecked />
            <input type="radio" name="rdo" id="plus1" />
            <div className="switch">
              <label htmlFor="minus1">-</label>
              <label htmlFor="plus1">+</label>
            </div>
          </div>
        </div>

        <div className="toggle-radio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
          <img src={toiletries} style={{ width: 50, height: 50 }} />
          <div style={{ marginTop: 10 }}>
            <input type="radio" name="rdo" id="minus2" defaultChecked />
            <input type="radio" name="rdo" id="plus2" />
            <div className="switch">
              <label htmlFor="minus2">-</label>
              <label htmlFor="plus2">+</label>
            </div>
          </div>
        </div>

        <div className="toggle-radio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
          <img src={shirt}  style={{ width: 50, height: 50 }} />
          <div style={{ marginTop: 10 }}>
            <input type="radio" name="rdo" id="minus2" defaultChecked />
            <input type="radio" name="rdo" id="plus2" />
            <div className="switch">
              <label htmlFor="minus2">-</label>
              <label htmlFor="plus2">+</label>
            </div>
          </div>
        </div>

        <div className="toggle-radio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
          <img src={electric} style={{ width: 50, height: 50 }} />
          <div style={{ marginTop: 10 }}>
            <input type="radio" name="rdo" id="minus2" defaultChecked />
            <input type="radio" name="rdo" id="plus2" />
            <div className="switch">
              <label htmlFor="minus2">-</label>
              <label htmlFor="plus2">+</label>
            </div>
          </div>
        </div>
      </Box>
  );
}

export default App;
