import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Plotly from 'plotly.js-dist';

async function getNumber() {
  try {
    const response = await axios.get('http://127.0.0.1:5000/');
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function App() {
  const [y, setY] = useState([1]);
  const [x, setX] = useState([1]);

  const [data1, setData1] = useState(1)
  const [avrg, setAvrg] = useState([1])
  const [showAverage, setShowAverage] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  const [animationFrame, setAnimationFrame] = useState(0);

  const ms = 10;

  useEffect(() => {

    const intervalId = setInterval(async () => {
      if(avrg.length === 1 || avrg.length === 0) {
        setData1(1);
      }
      let num = await getNumber();
      let num2 = await getNumber();

        setY((prevY) => [...prevY, num]); // Append a random number between 0 and 10
        setX((prevX) => [...prevX, prevX[prevX.length - 1] + 1])
     
       // setY((prevY) => [...prevY, num2]); // Append a random number between 0 and 10
       // setX((prevX) => [...prevX, prevX[prevX.length - 1] + 1])
      

      if (ms === 10 && x[x.length - 1] + 1 % 10) {
        setAvrg((prevAvrg) => [...prevAvrg, (data1) / ((x[x.length - 1] + 1) / 2.5)]);
      } else if (ms === 100) {
        setAvrg((prevAvrg) => [...prevAvrg, ((data1) / (x[x.length - 1] + 1))]); // Calculate average
      }

      setData1((data1 + num));
      setAnimationFrame(prevFrame => prevFrame + 1);

    }, ms); // Adjust the interval (in milliseconds) according to your needs

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [y, avrg, data1, x]);

  const toggleAverageVisibility = () => {
    setShowAverage(!showAverage);
  };

  const togglePriceVisibility = () => {
    setShowPrice(!showPrice);
  };

  const maxVisiblePoints = 100;

  // Calculate the x-axis range based on the maximum number of visible points
  const xRange = [Math.max(0, animationFrame - maxVisiblePoints + 1), animationFrame];

  return (
    <>
      <div style={{ display: 'block', flexDirection: 'column', backgroundColor: '#212121', margin: 0 }}>
        <h1 style={{ color: 'white', fontFamily: 'verdana', textAlign: 'center', paddingTop: 15, margin: 0, height: 70 }}>ConU24</h1>

        <div style={{ display: 'flex' }}>

          <Plot
            data={[
              {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Symbol',
                marker: { color: 'lightgrey' },
                visible: showPrice ? 'true' : 'legendonly',
              },
              {
                x: x,
                y: avrg,
                visible: showAverage ? 'true' : 'legendonly',
                type: 'scatter',
                mode: 'lines',
                name: 'Average',
                marker: { color: 'red' },
              },
            ]}
            layout={{
              width: 1050, height: 550, title: 'Realtime Price and Average', titlefont: { size: 18 }, paper_bgcolor: '#333536', plot_bgcolor: '#333536',
              xaxis: {
                title: 'Time',
                range: xRange,  // Set the x-axis range
                mirror: true,
                ticks: 'outside',
                showline: true,
                linecolor: 'lightgrey',
                gridcolor: 'lightgrey',
                color: 'white',
              },
              yaxis: {
                title: 'Price', log: true,
                mirror: true,
                ticks: 'outside',
                showline: true,
                linecolor: 'lightgrey',
                gridcolor: 'lightgrey',
                color: 'white',
              },
              showlegend: false
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: 'center' }}>
            <div style={{ display: 'flex' }}>
              <input
                type="checkbox"
                checked={showPrice}
                onChange={() => { togglePriceVisibility() }}
              />
              <p style={{ color: 'white', fontFamily: 'verdana' }}>Current: {y[y.length - 1].toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex' }}>
              <input
                type="checkbox"
                checked={showAverage}
                onChange={() => { toggleAverageVisibility() }}
              />
              <p style={{ color: 'red', fontFamily: 'verdana' }}>Average: {avrg[avrg.length - 1].toFixed(2)}</p>
            </div>

          </div>
        </div>
        <div style={{ height: 100 }} />
        <Plot
          data={[
            {
              x: x,
              y: y,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
            },
          ]}
          layout={{
            width: 1050, height: 550, title: 'Graph 2', titlefont: { size: 32 }, paper_bgcolor: '#333536', plot_bgcolor: '#333536',
            xaxis: {
              color: 'white'
            }, yaxis: {
              color: 'white'
            }
          }}
        />

        {/* <div class="flourish-embed flourish-bar-chart-race" data-src="visualisation/16520746"><script src="https://public.flourish.studio/resources/embed.js"></script></div> */}
      </div>
    </>



  );
}

export default App;
