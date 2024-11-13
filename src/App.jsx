import React, { useState, useEffect } from "react";

const App = () => {
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isGameActive, setIsGameActive] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [totalReward, setTotalReward] = useState(0);

  // Start Game Function
  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setIsGameActive(true);
    generateBalloons();
  };

  useEffect(() => {
    const savedReward = parseInt(localStorage.getItem("totalReward")) || 0;
    setTotalReward(savedReward);
  }, []);

  // Timer effect for the game
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
      updateTotalReward();
    }
  }, [isGameActive, timeLeft]);

  // Update total reward in localStorage when game ends
  const updateTotalReward = () => {
    const previousScore = parseInt(localStorage.getItem("totalReward")) || 0;
    const updatedScore = previousScore + score;
    localStorage.setItem("totalReward", updatedScore);
    setTotalReward(updatedScore);
  };

  // here is where I Generate Random Balloons
  const generateBalloons = () => {
    const newBalloons = Array.from({ length: 5 }, () => ({
      id: Math.random(),
      left: Math.random() * 80 + 10,
      top: -10, // Start above the screen
    }));
    setBalloons(newBalloons);
  };

  // here is where the Falling animation effect
  useEffect(() => {
    if (isGameActive) {
      const interval = setInterval(() => {
        setBalloons(
          (prevBalloons) =>
            prevBalloons
              .map((balloon) => ({
                ...balloon,
                top: balloon.top + 2, // Increase top to simulate falling logic here
              }))
              .filter((balloon) => balloon.top < 100) // I Remove balloons that have fallen past the screen here
        );
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isGameActive]);

  //the function to Handle Balloon Tap
  const handleBalloonClick = (id) => {
    if (!isGameActive) return;
    setScore((prevScore) => prevScore + Math.floor(Math.random() * 10) + 1);
    setBalloons((prevBalloons) =>
      prevBalloons.filter((balloon) => balloon.id !== id)
    );
  };

  // I use this to generate new balloons when current ones disappear
  useEffect(() => {
    if (balloons.length === 0 && isGameActive) {
      generateBalloons();
    }
  }, [balloons, isGameActive]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const claimTokens = () => {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200">
      {!isUsernameSet ? (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">What should we call you?</h1>
          <form
            onSubmit={handleUsernameSubmit}
            className="flex flex-col items-center"
          >
            <input
              type="text"
              placeholder="Enter your username...."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 mb-4 rounded-lg border-2 border-gray-300 text-center"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg"
            >
              Next
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">CT Game Portal</h1>
          <p className="text-lg">
            Welcome, {username}! You can earn free codeTokens by playing this
            game 🎈🎈
          </p>

          <div className="text-lg mb-2 mt-8">
            <span className="font-bold">Score:</span> {score}
          </div>
          <div className="text-lg mb-2">
            <span className="font-bold">Total Reward:</span> {totalReward}
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
            <div className="relative w-full h-80 overflow-hidden">
              {balloons.map((balloon) => (
                <div
                  key={balloon.id}
                  onClick={() => handleBalloonClick(balloon.id)}
                  style={{
                    position: "absolute",
                    top: `${balloon.top}%`,
                    left: `${balloon.left}%`,
                    transition: "top 0.1s linear", // Smooth falling stuffs here. not perfect yet
                  }}
                  className="w-14 h-14 bg-red-400 rounded-full cursor-pointer"
                />
              ))}
            </div>
          )}

          {/* Game Over Modal */}
          {!isGameActive && timeLeft === 0 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 text-center w-2/4">
                <div className="flex justify-end">
                  <button
                    onClick={claimTokens}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  >
                    Claim Tokens
                  </button>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Time's Up!</h2>
                <p className="mb-4">Your final score: {score}</p>
                <p className="mb-4">Claimable Rewards: {totalReward} $CDT</p>
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
      )}
    </div>
  );
};

export default App;
