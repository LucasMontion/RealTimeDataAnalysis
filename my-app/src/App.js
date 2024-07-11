import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import SearchableDropdown from "./searchable.js";



function App() {
  const [y, setY] = useState([]);
  const [x, setX] = useState([]);
  const [tempx, setTempx] = useState(0);
  const [isGreen, setIsGreen] = useState(false);
  const [value, setValue] = useState("Select option...");
  const ms = 100;

  const [symbol, setSymbol] = useState('EDG7Z');
  const [symbolList, setSymbolList] = useState([]);
  let handleSymbolChange = (e) => {
    setSymbol(e.target.value);
    setY([]);
    setX([]);
  }
  const [exchange, setExchange] = useState('Exchange1');
  let handleExchangeChange = (e) => {
    setExchange(e.target.value);
  }




  useEffect(() => {
    async function getNumber() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/get/' + symbol);
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    }

    async function getSymbols() {
      try {
        console.log('Getting symbols');
        const response = await axios.get('http://127.0.0.1:5000/get_symbols/' + exchange);
        setSymbolList(response.data);
        console.log(response.data[0]);
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    }



    const intervalId = setInterval(async () => {

      var num = await getNumber();
      if (num !== []) {
        for (let n = 0; n < num.length; n++) {
          setY((prevY) => [...prevY, num[n][1]]); // Append the order price of the symbol
          if (num[n][1] > tempx) {
            setIsGreen(true);
          } else {
            setIsGreen(false);
          }
          setTempx(num[n][1]);
          setX((prevX) => [...prevX, num[n][0]]); // Move to next point on the chart        
        }

      }

    }, ms); // Adjust the interval (in milliseconds) according to your needs

    getSymbols();
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [y, symbol, tempx, x, exchange]);


  return (
    <>
      <div style={{ display: 'block', flexDirection: 'column', backgroundColor: '#212121', margin: 0 }}>
        <h1 style={{ color: 'white', fontFamily: 'verdana', textAlign: 'center', paddingTop: 15, margin: 0, height: 70 }}>Real Time Data Chart</h1>
        <select onChange={handleExchangeChange}>
          <option value={'Exchange1'}>Exchange 1</option>
          <option value={'Exchange2'}>Exchange 2</option>
          <option value={'Exchange3'}>Exchange 3</option>
        </select>
        <select onChange={handleSymbolChange}>
          {symbolList.map((sym) => <option value={sym}>{sym}</option>)}
        </select>

        <div style={{ display: 'flex' }}>


          <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: 'center' }}>
            <div style={{ display: 'flex' }}>
              <p style={{ color: 'white', fontFamily: 'verdana', fontSize: 24 }}>{symbol}: </p>
              <p></p>
              <p style={{ color: isGreen ? 'green' : 'red', fontSize: 24, fontFamily: 'verdana' }}> {y[y.length - 1]}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
              <div style={{ display: 'flex', width: '100' }}>
                <Plot
                  data={[
                    {
                      x: x,
                      y: y,
                      type: 'scatter',
                      mode: 'lines+markers',
                      marker: {
                        color: 'rgba(255, 255, 255, 1.0)',
                        size: 8,
                        line: {
                          color: 'rgba(255, 255, 255, 1.0)',
                          width: 2,
                        }
                      },
                      line: {
                        color: 'rgba(255, 255, 255, 1.0)',
                        width: 0.5,
                      }
                    },
                  ]}
                  layout={{
                    width: 1050,
                    height: 550,
                    plot_bgcolor: '#2e2e2e',
                    paper_bgcolor: '#2e2e2e',
                    font: {
                      family: 'Arial, sans-serif',
                      size: 12,
                      color: '#fff'
                    },
                    xaxis: {
                      tickmode: 'auto',
                      showgrid: true,
                      zeroline: false,
                      gridcolor: '#444',
                      tickcolor: '#fff',
                      titlefont: {
                        color: '#fff'
                      },
                      tickfont: {
                        color: '#fff'
                      }
                    },
                    yaxis: {
                      showline: false,
                      gridcolor: '#444',
                      tickcolor: '#fff',
                      titlefont: {
                        color: '#fff'
                      },
                      tickfont: {
                        color: '#fff'
                      }
                    }
                  }}
                />
              </div>
              <div className="OB">

                <div className="OB__S">
                  <div className="OB__SL">Spread:</div>
                  <div className="OB__SP"></div>
                </div>

                <div className="OB__header">
                  <div className="OB__header1">Order Book</div>
                  <div className="OB__header2">
                    <div>Size</div>
                    <div>Price</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>

  );
}

export default App;
