// http://api.weatherapi.com/v1/current.json?key=1668ec30414f43a5a55121411221310&q=indore

import http from "./http-common";
const privateKey = "1668ec30414f43a5a55121411221310";
class ApiServices {
   
    


    getCurrentWeather(city) {
        return http.get(`/current.json?key=${privateKey}&q=${city}`);
    }

    getForCast(city) {
        return http.get(`/forecast.json?key=${privateKey}&q=${city}`);
    }

    getTimeZone(zone) {
        return http.get(`/timezone.json?key=${privateKey}&q=${zone}`);
    }

    getIP(IP) {
        return http.get(`/timezone.json?key=${privateKey}&q=${IP}`);
    }

    searchLocation(searchText) {
        return http.get(`/search.json?key=${privateKey}&q=${searchText}`);
    }

    futureWeather(next) {
        return http.get(`/future.json?key=${privateKey}&q=${next}`);
    }


   


}

export default new ApiServices();