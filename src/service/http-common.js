import axios from "axios";

export default axios.create({
    baseURL : "https://api.weatherapi.com/v1",
    headers: {
    "Content-type": "application/json"
  }
});