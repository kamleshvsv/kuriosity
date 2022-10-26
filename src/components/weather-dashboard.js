
import { useEffect, useRef, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import apiService from './../service/apiService';
const LocationUrl = "https://www.accuweather.com/web-api/autocomplete"


export function WeatherDashboard () {
    const handleRef = useRef(null);
    const navigate = useNavigate();
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    // const [weatherData, setWeatherData] = useState()
    const [sessionData, setSessionData]=  useState([])
    
    const [searchText, setSearchState] = useState("")
    const [locationList, setLocationList] = useState([])

    useEffect(() => {
      initRecent()
      setInterval(() => initRecent(), 500000)
    },[])

    const useOutsideClick = (ref) => {
        useEffect(() => {
          /**
           * Alert if clicked on outside of element
           */
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setLocationList([])
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
    }


    const initRecent = () => {
        if(localStorage.getItem('sessionData')){
            var name = JSON.parse(localStorage.getItem('sessionData'))
            getRecentSearchHistory(name)
         
        }else{

        }
    }


    //Get Recend History 
    const getRecentSearchHistory = async (name) => {
        const getResponse =  await Promise.all(
            name.map(async (name) => {
              const response = await apiService.getForCast(name).then(res => { 
                return res.data; 
               })
              .catch((error) => {
                 console.log(`ERROR: ${error}`);
              });;
              return await response;
            })
          );
          setSessionData(getResponse)
    }
   

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        });
        // getCurrentWeatherStatus()
        
      }, [lat, long])


   

    //Hangle Search Event
    useEffect(()=>{
        if(searchText === ''){
            setLocationList([])
        }else{
            getLocation(searchText)
        }
    },[searchText])

    useOutsideClick(handleRef);


    const getLocation = async (value) => {
        await fetch(`${LocationUrl}?query=${value}&language=en-us`)
      .then(res => res.json())
      .then(result => {
        setLocationList(result)
      });
    }



    //Manage active Condotion
const charecterInd = (data) => { 
    var final = [];
   let t = data.split(' ')[1].toString().split(':')[0]
   if(t.charAt(0) === '0'){
   var i = t.substring(1)
    final.push(i)
   } else {
    final.push(t)
   }
    return final.toString();
  
  } 



    return (
        <>
        <div className="mt-10 sm:mt-2 md:mt-2 lg:mt-10 relative text-black" >
            <h3 className='text-white text-2xl md:text-2xl sm:text-lg mb-4'>Search Location</h3>
            <input ref={handleRef}
                type="text"
                className='px-3 py-2 text-sm w-3/12 md:w-3/12 sm:w-11/12 rounded-2xl'
                placeholder="Search..."
                onChange={event => {setSearchState(event.target.value)}}
                onKeyPress={event => {
                    console.log(event.target.value)
              }}
            />
            
            <div ref={handleRef} >
           
              
                {locationList && locationList.length > 0 ? (
                      <div className='absolute left-0 right-0 g-dropdown overflow-auto p-3'>
                      <ul className='overflow-auto ul-style'>
                    {locationList.map((item, index) => (
                        <li key={index} 
                            onClick={() => {
                                navigate(`/weather/${item.localizedName}`)
                                // Router.prototype.LocationUrl(`/weather/${item.localizedName}`)
                                
                            }}
                            >
                            <div>{item.localizedName} - ({item.administrativeArea.localizedName})</div>
                            <small className='font-bold text-purple-700'>{item.country.localizedName.toUpperCase()}</small>
                        </li>
                    ))}
                </ul> 
                </div>
                ) : 
                (
                ""
                ) }
            </div>
        </div>
        <div className="grid grid-cols-4 gap-4 px-10 grid-layout-for-sm md:px-10 sm:px-2 md:grid-cols-4 md:gap-4 sm:grid-cols-1 sm:gap-0 justify-self-auto mt-5 md:mt-5 sm:mt-0">
            {sessionData && sessionData.length === 0 ? "" : (
                <>
                    {sessionData.map((recend, idx)=> (
                            <div key={idx} className="weather-box cursor-pointer" onClick={()=> {
                                navigate(`/weather/${recend.location.name}`)
                            }}>
                            <h4 className='text-left text-sm'>Current Weather <small className='float-right'>{recend && recend.location.localtime}</small></h4>
                            {recend && recend.location && recend.current  ? 
                               (
                                  <div className=''>
                                      <div className='text-left flex'>
                                          <img className='text-left' alt="weather" width={35} src={recend.forecast.forecastday[0].day.condition.icon} /> 
                                          <small className='mt-2'>{recend.forecast.forecastday[0].day.condition.text}</small>
                                      </div>
                                      <h2>
                                          <strong>{recend.location.name || ""} </strong>
                                          <small> ( {recend.location.country.toUpperCase() || ""} )</small>
                                      </h2>
                                      {recend.forecast.forecastday && recend.forecast.forecastday[0].hour.map((hour, idx)=> (
                                                  <h1 className="text-3xl font-bold" key={idx}> 
                                      {charecterInd(hour.time) === recend.location.localtime.split(' ')[1].toString().split(':')[0] ? (

                                     <span>{recend.forecast.forecastday[0].hour[idx].temp_c}° C </span> ) : ""}
                                        
                                      </h1> 
                                      ))}
                           
                                  </div>
                               ): 
                            (
                                <div className="text-center p-6">
                                    <div role="status">
                                        <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                )}     
                            </div>
                    ))}
                </>
      
                ) }
            
        </div>
        </>
      );
}