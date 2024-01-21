import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

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
  const [y, setY] = useState([2, 6, 3]);
  const [x, setX] = useState([1, 2, 3]);

  const [y2, setY2] = useState([2, 6, 3]);
  const [x2, setX2] = useState([1, 2, 3]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      let num = await getNumber();
      console.log(num)
      setY((prevY) => [...prevY, num]); // Append a random number between 0 and 10
      setX((prevX) => [...prevX, prevX[prevX.length - 1] + 1])

      let num2 = await getNumber();
      setY2((prevY2) => [...prevY2, num2]); // Append a random number between 0 and 10
      setX2((prevX2) => [...prevX2, prevX2[prevX2.length - 1] + 1])
    }, 10); // Adjust the interval (in milliseconds) according to your needs
    // console.log(y)
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [y]);

  return (
    <>
      <div style={{ display: 'block', flexDirection: 'column' }}>
        <Plot
          data={[
            {
              x: x,
              y: y,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
            },
            { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
          ]}
          layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
        />
        <Plot
        data={[
          {
            x: x2,
            y: y2,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
          { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        layout={{ width: 1020, height: 240, title: 'A Fancy Plot' }}
        />
        <div class="flourish-embed flourish-bar-chart-race" data-src="visualisation/16520746"><script src="https://public.flourish.studio/resources/embed.js"></script></div>
      </div>
    </>
   

    
  );
}

export default App;
