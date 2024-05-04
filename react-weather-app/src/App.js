// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import TopButtons from './compoents/TopButtons';

import UserInputs from './compoents/UserInputs';
import TandL from './compoents/TandL';
import TempandDetail from './compoents/TempandDetail';
import Forcast from './compoents/Forcast';
import getFormattedWatherData from './Services/weatherServices';



function App() {

  const [query,setQuery]=useState({q:berlin})
  const [units,setUnits]=useState('metric')
  const [weather,setWeather]=useState(null)
useEffect(()=>{
  const fetchWeather=async()=>{
    await getFormattedWatherData({...query,units}).then((data)=>{
      setWeather(data);
    });
    
  };
  fetchWeather();
},[query,units]); 
  const formatBackground=()=>{
    if(!weather)return' from-cyan-700 to-blue-700 '
    const thershold=units==='mertric'?20:60
    if(weather.temp <= thershold)return'from-cyan-700 to-blue-700'
 return'from-yellow-700 to-orange-700'
  }

    return (
        <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-brh-fit shadow-xl shadow-gray-400 ${formatBackground()} `}>
            <TopButtons setQuery={setQuery}/>
           <UserInputs setQuery={setQuery} units={units} setUnits={setUnits}/>
{weather && <div>
<TandL weather={weather}/>
<TempandDetail weather={weather}/>
<Forcast title="hourly forcast" items={weather.hourly}/>
<Forcast title="daily forcast" items={weather.daily}/>      
</div>}
</div>  
    );
}

export default App;
