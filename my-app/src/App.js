import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

async function getNumber() {
  return [1, 2, 3]
}

function App() {
  const [y, setY] = useState([2, 6, 3]);
  const [x, setX] = useState([1, 2, 3]);

  const [y2, setY2] = useState([2, 6, 3]);
  const [x2, setX2] = useState([1, 2, 3]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      let num = await getNumber();
      setY((prevY) => [...prevY, ...num]);
      setX((prevX) => [...prevX, prevX[prevX.length - 1] + 1])

      let num2 = await getNumber();
      setY2((prevY2) => [...prevY2, ...num]);
      setX2((prevX2) => [...prevX2, prevX2[prevX2.length - 1] + 1])
    }, 1000); // Adjust the interval (in milliseconds) according to your needs
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  return (
      <div style={{ display: 'block', flexDirection: 'column' }}>
        <div className="flourish-embed flourish-bar-chart-race" data-src="visualisation/16520746">
          <script src="https://public.flourish.studio/resources/embed.js"></script>
        </div>
        <Plot
          data={[
            {
              x: x,
              y: y,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
            },
            { type: 'bar', x: x, y: y },
          ]}
          layout={{ width: 1020, height: 340, title: 'A Fancy Plot' }}
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
          { type: 'bar', x: x2, y: y2 },
        ]}
        layout={{ width: 1020, height: 340, title: 'A Fancy Plot' }}
        />
      </div>   
  );
}

export default App;
