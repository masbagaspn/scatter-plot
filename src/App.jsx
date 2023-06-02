import { useEffect, useState } from "react";
import Chart from "./components/Chart";

function App() {
  const [dataset, setDataset] = useState(null);

  const getDataset = async () => {
    const response = await fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    );
    const data = await response.json();

    setDataset(data);
  };

  useEffect(() => {
    getDataset();
  }, []);

  return (
    <div className="w-screen max-w-screen h-screen max-h-screen font-jakarta p-20">
      <div
        id="chart-container"
        className="w-full grid place-content-center gap-10 relative"
      >
        <div>
          <h1 id="title" className="text-2xl text-center">
            Doping in Professional Bicycle Racing
          </h1>
          <p className="text-center mt-1">{`35 Fastest times up Alpe d'Huez`}</p>
        </div>
        {dataset ? <Chart data={dataset} /> : null}
      </div>
    </div>
  );
}

export default App;
