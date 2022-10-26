import { Header } from "../components/header";
import { WeatherDashboard } from "../components/weather-dashboard";

export default function Main() {
    return (
      <>
        <div className='absolute top-0 text-white w-full mt-20'>
            <WeatherDashboard />
          </div>
        </>
    );
  }