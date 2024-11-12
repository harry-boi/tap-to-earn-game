import React, { useState, useEffect } from "react";

const App = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isGameActive, setIsGameActive] = useState(false);
  const [balloons, setBalloons] = useState([]);

  // Start Game Function
  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setIsGameActive(true);
    generateBalloons();
  };

  // Timer effect
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
    }
  }, [isGameActive, timeLeft]);

  // Generate Random Balloons
  const generateBalloons = () => {
    const newBalloons = Array.from({ length: 5 }, () => ({
      id: Math.random(),
      left: Math.random() * 80 + 10, // Random position within 10-90% of screen width
    }));
    setBalloons((prevBalloons) => [...prevBalloons, ...newBalloons]);
  };

  // Handle Balloon Tap
  const handleBalloonClick = (id) => {
    if (!isGameActive) return;
    setScore((prevScore) => prevScore + 1);
    setBalloons((prevBalloons) =>
      prevBalloons.filter((balloon) => balloon.id !== id)
    );
  };

  // Trigger to generate new balloons when current ones disappear
  useEffect(() => {
    if (balloons.length === 0 && isGameActive) {
      generateBalloons();
    }
  }, [balloons, isGameActive]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200">
      <h1 className="text-3xl font-bold mb-4">CT Game Portal</h1>
      <p className="text-lg">
        You can earn free codeTokens by playing this game 🎈🎈
      </p>

      <div className="text-lg mb-2 mt-8">
        <span className="font-bold">Score:</span> {score}
      </div>
      <div className="text-lg mb-4">
        <span className="font-bold">Time Left:</span> {timeLeft}
      </div>

      {!isGameActive ? (
        <button
          onClick={startGame}
          className="px-6 py-4 mt-8 bg-green-500 text-white font-bold flex rounded-lg"
        >
          Start Game{" "}
          <span className="ms-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </span>
        </button>
      ) : (
        <div className="relative w-full h-80 overflow-hidden bg-blue-300">
          {balloons.map((balloon) => (
            <div
              key={balloon.id}
              onClick={() => handleBalloonClick(balloon.id)}
              style={{
                position: "absolute",
                top: "-10%", // Start above the screen
                left: `${balloon.left}%`,
                transition: "top 3s linear", // Simulate falling
              }}
              className="w-10 h-14 bg-red-400 rounded-full cursor-pointer"
            />
          ))}
        </div>
      )}

      {/* Game Over Modal */}
      {!isGameActive && timeLeft === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Time's Up!</h2>
            <p className="mb-4">Your final score: {score}</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-green-500 text-white rounded-lg mr-4"
            >
              Play Again
            </button>
            <button
              onClick={() => setIsGameActive(false)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg"
            >
              Quit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
