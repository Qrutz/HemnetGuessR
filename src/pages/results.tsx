import React from "react";
import results from "../../house.json";

const ResultsPage: React.FC<{ housePrice: number; bestGuess: number }> = ({
  housePrice,
  bestGuess,
}) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center  bg-green-700">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Results</h2>
        <p className="mb-4 text-gray-600">
          The house price is <span className="font-bold">${results.price}</span>
          .
        </p>
        <p className="mb-4 text-gray-600">
          Your best guess was <span className="font-bold">{bestGuess}</span>.
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;
