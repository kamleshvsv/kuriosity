import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from './../service/apiService';
import sideImage from './../OKYJ1L0.jpg';
import { DownloadTableExcel } from "react-export-table-to-excel";


export default function SeprateWeather() {
  const [currentDate, setCurrentDate] = useState('')
  const [forcastData, setForcastData] = useState([])
  const [sessionData, setSessionData] = useState([])

  const params = useParams()
  const navigate = useNavigate()
  const [error, showError] = useState(false)

  const tableRef = useRef(null);
  const mainRef = useRef(null);
  

  // const fileType = "applicaton/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  // const fileExtention = ".xlsx";


  useEffect(()=> {
    let date = new Date()
    var datestring = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()  + " " +
    date.getHours() + ":" + date.getMinutes();
    setCurrentDate(date.getHours())

    if(localStorage.getItem('sessionData')){
      var  sessionArray = JSON.parse(localStorage.getItem('sessionData'))
     for(let i = 0; i < sessionArray.length; i ++){
      if(sessionArray[i] === params.name){
        getCurrentForecastStatus(params.name)
      }else{
        var empArr = []
        empArr.push(params.name)
        var finalArr = empArr.concat(sessionArray.filter((item) => empArr.indexOf(item) < 0));
        let date = new Date();
        // console.log(date, "its current date Or timee")
        finalArr.map((item) => {
          if(item.urrentTimeZone === date){

          }
        })

       getCurrentForecastStatus(params.name)
        localStorage.setItem('sessionData', JSON.stringify(finalArr))
      }

     }

    }else{
      var empArr2 = []
      empArr2.push(params.name)
      localStorage.setItem('sessionData', JSON.stringify(empArr2))
      getCurrentForecastStatus(params.name)
    
    }

    setInterval(() => getCurrentForecastStatus(params.name), 500000)
   
  },[])

  //export excell data
  // const exportToExcel = async (excellData, fileName) => {
  //   console.log(excellData.location)
  //   const ws = XLSX.utils.json_to_sheet(excellData);
  //   const wb = {Sheets : {'data' : ws}, SheetName : ['data']};
  //   const buffer = XLSX.write (wb, {bookType : 'xlsx', type:"array"});
  //   const data =  new Blob([buffer], {type : fileType});
  //   FileSaver.saveAs(data, fileName + fileExtention)
  // }



  const getCurrentForecastStatus = (value) => {
    apiService.getForCast(value)
    .then((res)=> {
        if(res.status === 200){
          setForcastData(res.data)
          initRecent()
          // if(localStorage.getItem('sessionData')){
          // initRecent()
          // }
        }
    }).catch((err)=>{
        removeUnMatchingData(params.name)
        showError(true);
        setInterval(() => navigate('/') , 10000)
       
    })
}

//remove not found data
const removeUnMatchingData = (name) => {
  if(localStorage.getItem('sessionData')){
    var  sessionArray = JSON.parse(localStorage.getItem('sessionData'))
    for(let i = 0; i < sessionArray.length; i ++){
      if(sessionArray[i] === name){
       var index = sessionArray.indexOf(name);
        if (index !== -1) {
          sessionArray.splice(index, 1);
        }
        
      }
    }
  }
    
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

const initRecent = () => {
  if(localStorage.getItem('sessionData')){
      var name = JSON.parse(localStorage.getItem('sessionData'))
      console.log(name , "before")
      const index = name.indexOf(params.name);
if (index > -1) { // only splice array when item is found
  name.splice(index, 1); // 2nd parameter means remove one item only
}
console.log(name, "after")
      getRecentSearchHistory(name)
   
  }else{
    console.log("No Search Record found")
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
    console.log(getResponse, "heyy")
}



    return (
     <> 
     <button className="back-btn" onClick={()=> {
      navigate(`/`)
     }}>Back To Dashboard</button>
      <div className="flex px-10 md:px-10 sm:px-6">
        <div className=" w-8/12 md:w-8/12 sm:w-full  shodow ">
          {forcastData && !forcastData.current ? (
            <div className="text-center ">
            <div role="status">
                <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
          ) : (
            <>
              <div className="card-background p-3 rounded"  style={{backgroundImage : `url(${forcastData.forecast.forecastday[0].day.condition.icon})`, backgroundPosition:"center",backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPositionX:"right"}}>
                <h4 className="text-left">Current Weather   
                  <em className="ml-3 text-sm">"{forcastData && forcastData.location.name} 
                    - {forcastData && forcastData.location.name} 
                    <span className="ml-2">({forcastData && forcastData.location.country.toUpperCase()})</span>
                    "</em>
                    <small className="float-right md:float-right sm:float-none">Last Update : {forcastData.location.localtime} </small>
                </h4>
                {forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].hour.map((hour, idx)=> (

                    <div  key={idx} hidden={charecterInd(hour.time) !== forcastData.location.localtime.split(' ')[1].toString().split(':')[0]}>
                      {charecterInd(hour.time) === forcastData.location.localtime.split(' ')[1].toString().split(':')[0] ? (
                        <div >
                            <h4 className="sm:mt-2">
                           
                              {forcastData && forcastData.location.name} - {forcastData && forcastData.location.country.toUpperCase()} 
                            </h4>
                            <div id="container" className="mt-2">
                              <div id="flip" className="text-4xl font-bold text-white">
                              <div><small className="text-sm">Temperature</small><div><span className="border p-4 rounded-lg">{hour.temp_c.toString().split('.')[0]}° <small className="text-sm">C</small></span></div></div>
                              <div><small className="text-sm">Humidity</small><div><span className="border p-4 rounded-lg">{hour.humidity.toString().split('.')[0]}<small className="text-sm">%</small></span></div></div>
                              <div><small className="text-sm">Feels Like</small><div><span className="border p-4 rounded-lg">{hour.feelslike_c.toString().split('.')[0]}<small className="text-sm">%</small></span></div></div>
                              </div>                      
                              </div>
                            <span className="text-gray-600 text-sm"><strong>{forcastData.forecast.forecastday[0].day.condition.text}</strong> Conditions will continue all day. Wind gusts are up to <strong>{forcastData.forecast.forecastday[0].day.maxwind_mph || ""}</strong> mph</span>
                          
                          <br />
                          <h4 className="text-left mt-3 mb-1 text-sm">Today's Average Weather</h4>
                          <div className="grid grid-cols-4 gap-4  md:grid-cols-4 md:gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Condition</h4>
                              <div className=" text-center flex">
                                <img src={forcastData.forecast.forecastday[0].day.condition.icon} width={20}  alt="today weather icon"/>
                                <strong className="ml-1 text-ellipsis">{forcastData.forecast.forecastday[0].day.condition.text} </strong>
                                </div>
                            </div>
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Temperature</h4>
                              <strong>{forcastData.forecast.forecastday[0].day.avgtemp_c}° <small>C</small> </strong>
                            </div>
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Humidity</h4>
                              <strong>{forcastData.forecast.forecastday[0].day.avghumidity} <small>%</small> </strong>
                            </div>
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Chance Of Rain</h4>
                              <strong>{forcastData.forecast.forecastday[0].day.daily_chance_of_rain}<small>%</small>  </strong>
                            </div>
                           
                            {/* <small>Today's Average Weather -  {forcastData.forecast.forecastday[0].day.avgtemp_c}° C ,Humidity { forcastData.forecast.forecastday[0].day.avghumidity} ,Rain Chance - {forcastData.forecast.forecastday[0].day.daily_chance_of_rain}%,  </small> */}
                          </div>
                        </div>
                      ) : ""}                      

                    </div>
                  ))
                } 
              </div>
              <div className="card-background p-3 mt-8 rounded">
                <h4 className="text-left mb-2">Forecast Day  
                 {forcastData && forcastData.forecast && forcastData.forecast.forecastday.length === 0 ? "" : (
                    <span className="ml-2 text-sm desktop-view">(Today's Min Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.mintemp_c}° C</strong> & Max Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.maxtemp_c}° C</strong>)</span>
                  )} <small className="float-right md:float-right sm:float-none">Last Update : {forcastData.location.localtime || ""}</small></h4>
                  {/* <br /> */}
                  <DownloadTableExcel className="float-right"
        filename={forcastData.location.name}
        sheet={forcastData.location.name}
        currentTableRef={mainRef.current}
      >
        <i class="fa fa-file-excel-o" aria-hidden="true"></i> 
      </DownloadTableExcel>

                  <div className="mobile-view">
                  <span className="ml-2 text-sm ">(Today's Min Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.mintemp_c}° C</strong> & Max Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.maxtemp_c}° C</strong>)</span>
                  </div>

                <div className="	border-t">
                  {forcastData && forcastData.forecast && forcastData.forecast.forecastday.length === 0 ? "Not Found" : (
                    <div className="text-left table-overflow">
                

                      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400" ref={mainRef}> 
                          <thead>
                          <tr>
                              <th scope="col" className="py-2 px-1" > Condition</th>
                              <th scope="col" className="py-2 px-1">Date & Time</th>
                              <th scope="col" className="py-2 px-1">Temperature</th>
                              <th scope="col" className="py-2 px-1">Humidity</th>
                              <th scope="col" className="py-2 px-1">Feels Like</th>
                              <th scope="col" className="py-2 px-1">Chance Of Rain</th>
                              <th scope="col" className="py-2 px-1">Wind</th>
                          </tr>
                          </thead>
                          <tbody >
                          {forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].hour.map((hour, ind)=> (

                                      <tr  key={ind} 
                                      className={`${charecterInd(hour.time) === currentDate.toString() ? "activeTime" : ""}`}
                                      >
                                          {hour.condition ? ( <td className="py-1 px-1 flex">
                                                <img src={hour.condition.icon} alt="condition" width={20} /> {hour.condition.text}</td> ) : ""}
                                          <td className="py-1 px-1">{hour.time}</td>
                                          <td className="py-1 px-1">{hour.temp_c}° C</td>
                                          <td className="py-1 px-1">{hour.humidity} %</td>
                                          <td className="py-1 px-1">{hour.feelslike_c}°</td>
                                          <td className="py-1 px-1">{hour.chance_of_rain} %</td>
                                          <td className="py-1 px-1">{hour.wind_mph} mph</td>                                                                       
                                      </tr>
                                  ))
                              } 
                          </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
            )}
             {!error ? "" : (
        <h1 className="text-center text-3xl text-white p-6">No matching location found.</h1>
      )}
        </div>
        <div className="ml-10 w-4/12 md:w-4/12 desktop-view shodow ">
          <div className=" rounded">
              <img className="rounded px-3"  src={sideImage} alt="weather" />
            </div>
        </div>
      </div>
      <h2 className="text-left text-white p-10">Recent Search History</h2>
     
      {sessionData.map((session, i)=> (
      <div className="flex px-10 md:px-10 sm:px-6 mt-2 ">
        <div key={i} className="w-8/12 md:w-8/12 sm:w-full" style={{margin:"5px"}}>
        < >
             
              <div className="card-background p-3 rounded"  style={{backgroundImage : `url(${session.forecast.forecastday[0].day.condition.icon})`, backgroundPosition:"center",backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPositionX:"right"}}>
                <h4 className="text-left">Current Weather   
                  <em className="ml-3 text-sm">"{session && session.location.name} 
                    - {forcastData && forcastData.location.name} 
                    <span className="ml-2">({forcastData && forcastData.location.country.toUpperCase()})</span>
                    "</em>
                    <small className="float-right md:float-right sm:float-none">Last Update : {session.location.localtime} </small>
                </h4>
                {session.forecast.forecastday && session.forecast.forecastday[0].hour.map((hour, idx)=> (

                    <div  key={idx} hidden={charecterInd(hour.time) !== session.location.localtime.split(' ')[1].toString().split(':')[0]}>
                      {charecterInd(hour.time) === session.location.localtime.split(' ')[1].toString().split(':')[0] ? (
                        <div >
                            <h4 className="sm:mt-2">
                           
                              {session && session.location.name} - {session && session.location.country.toUpperCase()} 
                            </h4>
                            <div id="container" className="mt-2">
                              <div id="flip" className="text-4xl font-bold text-white">
                              <div><small className="text-sm">Temperature</small><div><span className="border p-4 rounded-lg">{hour.temp_c.toString().split('.')[0]}° <small className="text-sm">C</small></span></div></div>
                              <div><small className="text-sm">Humidity</small><div><span className="border p-4 rounded-lg">{hour.humidity.toString().split('.')[0]}<small className="text-sm">%</small></span></div></div>
                              <div><small className="text-sm">Feels Like</small><div><span className="border p-4 rounded-lg">{hour.feelslike_c.toString().split('.')[0]}<small className="text-sm">%</small></span></div></div>
                              </div>                      
                              </div>
                            <span className="text-gray-600 text-sm"><strong>{session.forecast.forecastday[0].day.condition.text}</strong> Conditions will continue all day. Wind gusts are up to <strong>{forcastData.forecast.forecastday[0].day.maxwind_mph || ""}</strong> mph</span>
                          
                          <br />
                          <h4 className="text-left mt-3 mb-1 text-sm">Today's Average Weather</h4>
                          <div className="grid grid-cols-4 gap-4  md:grid-cols-4 md:gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Condition</h4>
                              <div className=" text-center flex">
                                <img src={session.forecast.forecastday[0].day.condition.icon} width={20}  alt="today weather icon"/>
                                <strong className="ml-1 text-ellipsis">{session.forecast.forecastday[0].day.condition.text} </strong>
                                </div>
                            </div>
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Temperature</h4>
                              <strong>{session.forecast.forecastday[0].day.avgtemp_c}° <small>C</small> </strong>
                            </div>
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Humidity</h4>
                              <strong>{session.forecast.forecastday[0].day.avghumidity} <small>%</small> </strong>
                            </div>
                            <div className="text-left weather-box-layout">
                              <h4 className="text-ellipsis">Chance Of Rain</h4>
                              <strong>{session.forecast.forecastday[0].day.daily_chance_of_rain}<small>%</small>  </strong>
                            </div>
                           
                            {/* <small>Today's Average Weather -  {session.forecast.forecastday[0].day.avgtemp_c}° C ,Humidity { session.forecast.forecastday[0].day.avghumidity} ,Rain Chance - {session.forecast.forecastday[0].day.daily_chance_of_rain}%,  </small> */}
                          </div>
                        </div>
                      ) : ""}                      

                    </div>
                  ))
                } 
              </div>
              <div className="card-background p-3 mt-5 rounded">
                <h4 className="text-left mb-2">Forecast Day  
                 {forcastData && forcastData.forecast && forcastData.forecast.forecastday.length === 0 ? "" : (
                    <span className="ml-2 text-sm desktop-view">(Today's Min Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.mintemp_c}° C</strong> & Max Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.maxtemp_c}° C</strong>)</span>
                  )} <small className="float-right md:float-right sm:float-none">Last Update : {forcastData.location.localtime || ""}</small></h4>
                  {/* <br /> */}
                  <DownloadTableExcel className="float-right"
        filename={session.location.name}
        sheet={session.location.name}
        currentTableRef={tableRef.current}
      >
        <i class="fa fa-file-excel-o" aria-hidden="true"></i> 
      </DownloadTableExcel>

                  <div className="mobile-view">
                  <span className="ml-2 text-sm ">(Today's Min Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.mintemp_c}° C</strong> & Max Temp <strong>{forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].day.maxtemp_c}° C</strong>)</span>
                  </div>

                <div className="	border-t">
                  {forcastData && forcastData.forecast && forcastData.forecast.forecastday.length === 0 ? "Not Found" : (
                    <div className="text-left table-overflow">
               
           

                      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400" ref={tableRef}> 
                          <thead>
                          <tr>
                              <th scope="col" className="py-2 px-1" > Condition</th>
                              <th scope="col" className="py-2 px-1">Date & Time</th>
                              <th scope="col" className="py-2 px-1">Temperature</th>
                              <th scope="col" className="py-2 px-1">Humidity</th>
                              <th scope="col" className="py-2 px-1">Feels Like</th>
                              <th scope="col" className="py-2 px-1">Chance Of Rain</th>
                              <th scope="col" className="py-2 px-1">Wind</th>
                          </tr>
                          </thead>
                          <tbody >
                          {forcastData.forecast.forecastday && forcastData.forecast.forecastday[0].hour.map((hour, ind)=> (

                                      <tr  key={ind} 
                                      className={`${charecterInd(hour.time) === currentDate.toString() ? "activeTime" : ""}`}
                                      >
                                          {hour.condition ? ( <td className="py-1 px-1 flex">
                                                <img src={hour.condition.icon} alt="condition" width={20} /> {hour.condition.text}</td> ) : ""}
                                          <td className="py-1 px-1">{hour.time}</td>
                                          <td className="py-1 px-1">{hour.temp_c}° C</td>
                                          <td className="py-1 px-1">{hour.humidity} %</td>
                                          <td className="py-1 px-1">{hour.feelslike_c}°</td>
                                          <td className="py-1 px-1">{hour.chance_of_rain} %</td>
                                          <td className="py-1 px-1">{hour.wind_mph} mph</td>                                                                       
                                      </tr>
                                  ))
                              } 
                          </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
        </div>
        <div className="ml-10 w-4/12 md:w-4/12 desktop-view shodow ">
         <div className=" rounded">
             <img className="rounded px-3"  src={sideImage} alt="weather" />
           </div>
       </div>
   
                              
        
      </div>
         ))}


     </>
    );
  }