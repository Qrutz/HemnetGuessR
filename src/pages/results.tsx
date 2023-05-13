import React, { useEffect, useState } from "react";
import house from "../../house.json";

export default function results() {
  const [bestGuess, setBestGuess] = useState<string>("");

  useEffect(() => {
    // get the best guess from local storage
    compareGuessesToPrice();
  }, []);

  //create function to compare the guesses to the price and return the closest guess
  function compareGuessesToPrice() {
    // get the guesses from local storage
    const guesses = localStorage.getItem("guesses");
    if (guesses) {
      // convert the guesses to an array of numbers
      const guessesArray = guesses.split(",").map((guess) => Number(guess));
      console.log(guessesArray);

      // compare each guess to the price
      const price = house.price;
      const closestGuess = guessesArray.reduce((prevGuess, currentGuess) => {
        const prevGuessDifference = Math.abs(price - prevGuess);
        const currentGuessDifference = Math.abs(price - currentGuess);
        if (prevGuessDifference < currentGuessDifference) {
          return prevGuess;
        } else {
          return currentGuess;
        }
      });
      console.log(closestGuess);
      setBestGuess(closestGuess.toString());
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center  bg-green-700">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Results</h2>
        <p className="mb-4 text-gray-600">
          The house price is <span className="font-bold">{house.price.toLocaleString()} kr</span>.
        </p>
        <p className="mb-4 text-gray-600">
          Your best guess was <span className="font-bold">{Number(bestGuess).toLocaleString()} kr</span>.
        </p>
      </div>
    </div>
  );
}
