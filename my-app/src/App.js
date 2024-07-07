import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';



function App() {
  const [y, setY] = useState([]);
  const [x, setX] = useState([]);
  const [tempx, setTempx] = useState(0);
  const [isGreen, setIsGreen] = useState(false);


  const ms = 100;

  const [symbol, setSymbol] = useState('EDG7Z');
  const [symbolList, setSymbolList] = useState([]);
  let handleSymbolChange = (e) => {
    setSymbol(e.target.value);
    setY([]);
    setX([]);
  }
  const [exchange, setExchange ] = useState('Exchange1');
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
        const response = await axios.get('http://127.0.0.1:5000/get_symbols/' + exchange);
        setSymbolList(response.data);
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
  }, [y,symbol, tempx, x, exchange]);


  return (
    <>
      <div style={{ display: 'block', flexDirection: 'column', backgroundColor: '#212121', margin: 0 }}>
        <h1 style={{ color: 'white', fontFamily: 'verdana', textAlign: 'center', paddingTop: 15, margin: 0, height: 70 }}>ConU24</h1>
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
              <p style={{ color: 'white', fontFamily: 'verdana' }}>Current: </p><p style={{ color: isGreen ? 'green' : 'red' }}>{y[y.length - 1]}</p>
            </div>
            <div style={{ display: 'flex', width: '100'}}>
              <Plot
                data={[
                  {
                    x: x,
                    y: y,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: 'white' },
                  },
                ]}
                layout={{
                  width: 1050, height: 550, title: symbol, titlefont: { size: 32 }, paper_bgcolor: '#333536', plot_bgcolor: '#333536',
                  xaxis: {
                    title: 'Time',
                    tickmode: 'auto',
                    color: 'white'
                  }, yaxis: {
                    color: 'white'
                  }
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </>

  );
}

export default App;
