import {DateTime} from 'luxon';
const API_KEY="eeb2956847d943b665c0e35632666a2b";
const BASE_URL="https://api.openweathermap.org/data/2.5"

const getWeatherData=(infoType, searchParams) =>{
    const url= new URL(BASE_URL +"/"+infoType)
    url.search= new URLSearchParams({...searchParams,appid:API_KEY});

    return fetch(url).then((res)=> res.json());
};
const formatCurrectWeather=(data)=>{
    const{coord:{lat,lon},
main:{temp,feels_like,temp_min,temp_max,humidity},
name,
dt,
sys:{country,sunrise,sunset},
weather,
wind:{speed}

}=data

const{main:details,icon}=weather[0]

return {lat,lon,temp,feels_like,temp_min,temp_max,humidity,name,dt,country,sunrise,sunset,details,icon,speed}
};
const formatForcastWeather=(data)=>{
let {timezone,daily,hourly}=data;
daily=daily.slice(1,6).map(d=>{
    return{
        title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),

   temp:d.temp.day,
   icon: d.weather[0].icon

    }
});

hourly=hourly.slice(1,6).map(d=>{
    return{
       title:formatToLocalTime(d.dt,timezone,'hh:mm a'),
   temp:d.temp,
   icon: d.weather[0].icon

    }
});
return {timezone,daily,hourly};
};
const getFormattedWatherData=async (searchParams)=>{
    const formattedCurrectWeather = await getWeatherData("weather",searchParams).then(formatCurrectWeather);

    const{lat,lon}=formatCurrectWeather;

    const formattedForcastWeather=await getWeatherData("onecall",{
        lat,
        lon,
        exclude:"currect,minutely,alerts",
        units:searchParams.units
    }).then(formatForcastWeather)

    return {...formattedCurrectWeather,...formattedForcastWeather};
};
const formatToLocalTime=(secs,zone,format="cccc,dd LLL yyyy' | Local time:'hh:mm a")=> DateTime.fromSeconds(secs).setZone(zone).toFormat(format);
const iconUrlFromCode=(code)=>`http://openweathermap.org/img/wn/${code}@2x.png`
export default getFormattedWatherData;
export {formatToLocalTime,iconUrlFromCode};