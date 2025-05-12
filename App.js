import React, { useState } from 'react';
import Coin from './components/Coin';
import Scale from './components/Scale';
import { simulateDivideAndFindFake } from './utils/fakeCoinFinder';
import { simulateBruteForceFindFake } from './utils/bruteForceFinder';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [coinCount, setCoinCount] = useState(9);
  const [coins, setCoins] = useState([]);
  const [allSteps, setAllSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const [bruteSteps, setBruteSteps] = useState([]);
  const [bruteIndex, setBruteIndex] = useState(0);
  const [showBrute, setShowBrute] = useState(false);

  const generateCoins = () => {
    const fakeIndex = Math.floor(Math.random() * coinCount);
    const newCoins = Array.from({ length: coinCount }, (_, i) => ({
      id: i + 1,
      weight: i === fakeIndex ? 'light' : 'normal',
    }));
    setCoins(newCoins);
    setAllSteps([]);
    setShowSteps(false);
    setCurrentStepIndex(0);
    setBruteSteps([]);
    setBruteIndex(0);
    setShowBrute(false);
  };

  const startSimulation = () => {
    const steps = simulateDivideAndFindFake(coins);
    setAllSteps(steps);
    setShowSteps(true);
    setCurrentStepIndex(0);
  };

  const startBruteForce = () => {
    const steps = simulateBruteForceFindFake(coins);
    setBruteSteps(steps);
    setBruteIndex(0);
    setShowBrute(true);
  };

  const nextStep = () => {
    if (currentStepIndex < allSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const nextBruteStep = () => {
    if (bruteIndex < bruteSteps.length - 1) {
      setBruteIndex((prev) => prev + 1);
    }
  };

  // Time Complexity Data for Graph
  const generateChartData = () => {
    const nValues = Array.from({ length: 10 }, (_, i) => (i + 1) * 10); // Sample n values (10, 20, 30, ..., 100)
    const bruteForceValues = nValues; // Brute Force is O(n)
    const divideAndConquerValues = nValues.map(n => Math.log(n) / Math.log(3)); // Divide and Conquer is O(log₃ n)

    return {
      labels: nValues,
      datasets: [
        {
          label: 'Brute Force (O(n))',
          data: bruteForceValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
        {
          label: 'Divide & Conquer (O(log₃ n))',
          data: divideAndConquerValues,
          borderColor: 'rgba(153, 102, 255, 1)',
          fill: false,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-6 font-sans">
      <h1 className="text-4xl text-center font-bold text-indigo-700 mb-6">
        🧪 Fake Coin Finder
      </h1>

      <div className="text-center mb-6">
        <input
          type="number"
          min="3"
          className="px-4 py-2 border rounded"
          value={coinCount}
          onChange={(e) => setCoinCount(parseInt(e.target.value))}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded ml-4"
          onClick={generateCoins}
        >
          Generate Coins
        </button>
      </div>

      <div className="flex flex-wrap justify-center mb-6">
        {coins.map((coin) => (
          <Coin key={coin.id} {...coin} />
        ))}
      </div>

      <div className="text-center mb-4 space-x-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={startSimulation}
          disabled={coins.length === 0}
        >
          Start Divide & Conquer
        </button>

        <button
          className="px-4 py-2 bg-gray-800 text-white rounded"
          onClick={startBruteForce}
          disabled={coins.length === 0}
        >
          Start Brute Force
        </button>
      </div>

      {showSteps && allSteps.length > 0 && (
        <div className="text-center mt-6">
          <h2 className="text-xl font-semibold mb-2">⚖️ Divide & Conquer Steps</h2>
          <Scale steps={allSteps.slice(0, currentStepIndex + 1)} />

          {allSteps[currentStepIndex]?.final ? (
            <div className="mt-4 text-2xl text-red-600 font-bold animate-bounce">
              🎯 Found fake coin: Coin #{allSteps[currentStepIndex].final.id}
            </div>
          ) : currentStepIndex < allSteps.length - 1 ? (
            <button
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded"
              onClick={nextStep}
            >
              Next Step
            </button>
          ) : null}
        </div>
      )}

      {showBrute && bruteSteps.length > 0 && (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold mb-2">🔍 Brute Force Steps</h2>
          <div className="flex justify-center mb-4">
            {coins.map((coin) => {
              const isCoinBeingCompared = bruteSteps[bruteIndex]?.compare?.includes(coin.id);
              return (
                <Coin
                  key={coin.id}
                  {...coin}
                  highlight={isCoinBeingCompared}
                />
              );
            })}
          </div>

          <div className="text-lg font-bold text-gray-800">
            {bruteSteps[bruteIndex]?.stepMessage}
          </div>

          {bruteSteps[bruteIndex]?.final && (
            <div className="mt-4 text-2xl text-green-600 font-bold animate-bounce">
              🎯 Brute Force found the fake coin: Coin #{bruteSteps[bruteIndex].final.id}
            </div>
          )}

          {bruteIndex < bruteSteps.length - 1 && (
            <button
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
              onClick={nextBruteStep}
            >
              Next Brute Step
            </button>
          )}
        </div>
      )}

      {/* Time Complexity Comparison Graph */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-center mb-4">📊 Time Complexity Comparison</h2>
        <Line data={generateChartData()} />
      </div>

      <div className="mt-10 p-4 bg-white rounded shadow-md text-left max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-2">📊 Time Complexity Overview</h2>
        <p><strong>Brute Force:</strong> O(n) — Checks each coin one by one.</p>
        <p><strong>Divide & Conquer:</strong> O(log₃ n) — Narrows it down by thirds efficiently.</p>
      </div>
    </div>
  );
}

export default App;
