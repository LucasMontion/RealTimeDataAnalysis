import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Select from 'react-select'



function App() {
  const [y, setY] = useState([]);
  const [x, setX] = useState([]);
  const [tempx, setTempx] = useState(0);

  const [isGreen, setIsGreen] = useState(false);
  const [isGreenChange, setIsGreenChange] = useState(false);

  const ms = 100;
  const [loading, setIsLoading] = useState(false);

  const [symbol, setSymbol] = useState('');
  const [symbolList, setSymbolList] = useState([]);

  const [firstCall, setFirstCall] = useState(true);
  const [firstNum, setFirstNum] = useState(0);
  const [change, setChange] = useState('');

  let handleSymbolChange = (e) => {
    setSymbol(e.value);
    setY([]);
    setX([]);
    setFirstCall(true);
    setChange('');
  }
  const [exchange, setExchange] = useState('Exchange1');
  let handleExchangeChange = (e) => {
    setExchange(e.target.value);
    setIsLoading(true);
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
        const transformedOptions = response.data.map(item => ({
          value: item,
          label: item
        }));
        setSymbolList(transformedOptions);
        setIsLoading(false);
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    }

    function calcChange(firstNum, lastNum) {
      var change = (lastNum * 100 / firstNum) - 100;
      var changeStr = '';
      if (change >= 0) {
        changeStr = '+' + change.toFixed(2) + '%';
        setIsGreenChange(true);
      } else {
        changeStr = '' + change.toFixed(2) + '%';
        setIsGreenChange(false);
      }
      return changeStr;
    }

    const intervalId = setInterval(async () => {
      if (symbol !== '') {
        var num = await getNumber();



        if (num !== []) {
          if (firstCall && num[0] !== undefined) {
            setFirstNum(num[0][1]);
          }
          for (let n = 0; n < num.length; n++) {
            setY((prevY) => [...prevY, num[n][1]]); // Append the order price of the symbol
            if (firstCall === false && firstNum > 0) {
              setChange(calcChange(firstNum, num[n][1]));
            }

            if (num[n][1] > tempx) {
              setIsGreen(true);
            } else {
              setIsGreen(false);
            }
            setTempx(num[n][1]);
            setX((prevX) => [...prevX, num[n][0]]); // Move to next point on the chart        
          }

        }
        setFirstCall(false);
      }


    }, ms); // Adjust the interval (in milliseconds) according to your needs


    getSymbols();
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [y, symbol, exchange, tempx]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '16171A',
      color: 'white',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '16171A',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'gray' : '16171A',
      color: 'white',
      '&:hover': {
        backgroundColor: 'gray',
      }
    }),
  };

  return (
    <>
      <div style={{ display: 'block', flexDirection: 'column', backgroundColor: '#16171A', margin: 0 }}>
        <h1 style={{ color: 'white', fontFamily: 'verdana', textAlign: 'center', paddingTop: 15, margin: 0, height: 70 }}>Real Time Data Chart</h1>
        <div class="flexbox-container" style={{ display: 'flex', flexDirection: 'row' }}>
          <div>
            <select onChange={handleExchangeChange} style={{ fontFamily: 'verdana', fontWeight: 'bold', height: 40, backgroundColor: '#16171A', color: 'white' }}>
              <option value={'Exchange1'}>Exchange 1</option>
              <option value={'Exchange2'}>Exchange 2</option>
              <option value={'Exchange3'}>Exchange 3</option>
            </select>
          </div>
          <div></div>
          <div style={{ height: 40, fontWeight: 'bold', fontFamily: 'verdana', backgroundColor: '#16171A' }}>
            {
              symbolList !== [] && <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={symbol}
                isSearchable={true}
                name="Symbols"
                options={symbolList}
                onChange={handleSymbolChange}
                isLoading={loading}
                styles={customStyles}
              />
            }
          </div>
        </div>
        <div style={{ display: 'flex' }}>


          <div style={{ display: 'flex', flexDirection: 'column', alignItems: "left", justifyContent: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'row'}} >
              <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px', flexDirection: 'row' }}>
                <p style={{ color: 'white', fontFamily: 'verdana', fontSize: 24, paddingRight: '4px' }}>{symbol} : </p>
                <p style={{ color: isGreen ? 'green' : 'red', fontSize: 24, fontFamily: 'verdana' }}> {y[y.length - 1]}</p>
              </div>
              <div style={{ display: 'flex', paddingRight: '20px', flexDirection: 'row' }}>
                <p style={{ color: 'white', fontFamily: 'verdana', fontSize: 24, paddingRight: '4px' }}>Change : </p>
                <p style={{ color: isGreenChange ? 'green' : 'red', fontSize: 24, fontFamily: 'verdana' }}>{change}</p>
              </div>
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
