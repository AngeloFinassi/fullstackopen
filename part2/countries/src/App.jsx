import { useState, useEffect } from 'react'

import countryService from './services/countries'
import weatherService from './services/weather'


const Country = ({ country }) => {

  const [weather, setWeather] = useState(null)


  useEffect(() => {

    weatherService
      .getWeather(country.capital[0])
      .then(data => {
        setWeather(data)
      })

  }, [country])


  return (
    <div>

      <h2>{country.name.common}</h2>

      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>

      <h3>Languages</h3>

      <ul>
        {Object.values(country.languages)
          .map(lang =>
            <li key={lang}>{lang}</li>
          )}
      </ul>


      <img
        src={country.flags.png}
        width="150"
      />


      {weather && (

        <>
          <h3>Weather in {country.capital}</h3>

          <p>Temperature: {weather.main.temp} °C</p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />

          <p>Wind: {weather.wind.speed} m/s</p>
        </>

      )}

    </div>
  )
}



const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)


  useEffect(() => {

    countryService
      .getAll()
      .then(data => {
        setCountries(data)
      })

  }, [])


  const handleShow = (country) => {
    setSelected(country)
  }


  const filtered = countries.filter(c =>
    c.name.common.toLowerCase()
      .includes(filter.toLowerCase())
  )



  return (
    <div>

      <h2>Find countries</h2>

      <input
        value={filter}
        onChange={e => {
          setFilter(e.target.value)
          setSelected(null)
        }}
      />


      <div>

        {selected && (
          <Country country={selected} />
        )}


        {!selected && filtered.length > 10 &&
          <p>Too many matches, specify another filter</p>
        }


        {!selected && filtered.length <= 10 &&
          filtered.length > 1 &&

          filtered.map(c =>

            <div key={c.cca3}>

              {c.name.common}

              <button
                onClick={() => handleShow(c)}
              >
                show
              </button>

            </div>
          )
        }


        {!selected && filtered.length === 1 &&
          <Country country={filtered[0]} />
        }

      </div>

    </div>
  )
}

export default App
