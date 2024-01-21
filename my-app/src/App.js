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
  const [z, setZ] = useState([1]);

  const [y2, setY2] = useState([0]);
  const [x2, setX2] = useState([0]);


  const [data1, setData1] = useState(1)
  const [avrg, setAvrg] = useState([1])
  const [showAverage, setShowAverage] = useState(true);

  const [isPaused, setIsPaused] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {

    const intervalId = setInterval(async () => {
      let num = await getNumber();

      let numz = await getNumber();
      setZ((prevZ) => [...prevZ, numz]); // Append a random number between 0 and 10

      setY((prevY) => [...prevY, num]); // Append a random number between 0 and 10
      setX((prevX) => [...prevX, prevX[prevX.length - 1] + 1])


      setAvrg((prevAvrg) => [...prevAvrg, ((data1) / (x[x.length - 1] + 1))]); // Calculate average
      setData1((data1 + num));


      setAnimationFrame(prevFrame => prevFrame + 1);


      let num2 = await getNumber();
      setY2((prevY2) => [...prevY2, num2]); // Append a random number between 0 and 10
      setX2((prevX2) => [...prevX2, prevX2[prevX2.length - 1] + 1])
    }, 100); // Adjust the interval (in milliseconds) according to your needs
    // console.log(y)

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [y]);

  const toggleAverageVisibility = () => {
    setShowAverage(!showAverage);
  };

  const maxVisiblePoints = 100;

  // Calculate the x-axis range based on the maximum number of visible points
  const xRange = [Math.max(0, animationFrame - maxVisiblePoints + 1), animationFrame];


  return (
    <>
      <div style={{ display: 'block', flexDirection: 'column', alignItems: "center" }}>
        <Plot
          data={[
            {
              x: x,
              y: y,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Symbol',
              marker: { color: 'blue' },
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
            width: 1020, height: 500, title: 'A Fancy Plot 1', xaxis: {
              title: 'Time',
              range: xRange,  // Set the x-axis range
              mirror: true,
              ticks: 'outside',
              showline: true,
              linecolor: 'lightgrey',
              gridcolor: 'lightgrey',
              
            },
            yaxis: {
              title: 'Price', log: true, 
              mirror: true,
              ticks: 'outside',
              showline: true,
              linecolor: 'lightgrey',
              gridcolor: 'lightgrey'
            },
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
          <button onClick={toggleAverageVisibility}>
            {showAverage ? 'Hide Average' : 'Show Average'}
          </button>
        </div>
        <Plot
          data={[
            {
              x: x2,
              y: y2,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
            },
          ]}
          layout={{ width: 1020, height: 500, title: 'A Fancy Plot 2' }}
        />

        {/* <div class="flourish-embed flourish-bar-chart-race" data-src="visualisation/16520746"><script src="https://public.flourish.studio/resources/embed.js"></script></div> */}
      </div>
    </>



  );
}

export default App;
