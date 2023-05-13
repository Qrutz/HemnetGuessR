import React, { use, useEffect, useState } from "react";
import { InputBar } from "~/components/InputBar";
import { ProgressBar } from "~/components/ProgressBar";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import json from "../../house.json";

type FormValues = {
  guess: number;
};

interface gameData {
  guesses: number[];
  house: House;
}

type House = {
  price: number;
  images: string[];
};

// create json for a house listing which has a price, the image below anda bunch of rooms for that house

export default function game() {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const [gameData, setGameData] = useState<gameData>({
    guesses: [],
    house: json,
  });
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  const router = useRouter();

  const handleGuess = handleSubmit((data) => {
    setGameData((prevGameData) => {
      const newGameData = {
        guesses: [...prevGameData.guesses, data.guess],
        house: prevGameData.house,
      };
      localStorage.setItem("guesses", JSON.stringify(newGameData.guesses));
      return newGameData;
    });

    setCurrentGuessIndex((prevIndex) => prevIndex + 1);
  });

  function saveGameDataToLocalStorage() {
    localStorage.setItem("guesses", gameData.guesses.toLocaleString());
  }

  function handleGoBackToLastGuess() {
    // we can only go back to 0 at most
    console.log(currentGuessIndex);
    if (currentGuessIndex === 0) {
      return;
    }

    setCurrentGuessIndex((prevIndex) => prevIndex - 1);
  }

  function handleGoToNextGuess() {
    // we can only go forward to the length of the guesses array
    if (currentGuessIndex === gameData.guesses.length) {
      return;
    }

    setCurrentGuessIndex((prevIndex) => prevIndex + 1);
  }

  useEffect(() => {
    const savedGuessess = localStorage.getItem("guesses");
    if (savedGuessess) {
      setGameData({
        guesses: JSON.parse(savedGuessess),
        house: gameData.house,
      });
    }
  }, []);

  // on refresh set current guess to the length of the guesses array
  useEffect(() => {
    setCurrentGuessIndex(gameData.guesses.length);
  }, [gameData.guesses]);

  //if guessess array length is 6 then redirect to results page
  useEffect(() => {
    if (gameData.guesses.length === 6) {
      saveGameDataToLocalStorage();
      router.push("/results");
    }
  }, [gameData.guesses]);

  return (
    <div className="flex h-screen items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950  to-emerald-900 font-mono">
      <div className="flex h-full w-[33rem] flex-col justify-evenly ">
        <span className="flex flex-col gap-2 ">
          <ProgressBar progress={(currentGuessIndex / 6) * 100} />
          <h2 className="text-4xl font-bold text-amber-300">
            ATTEMPT #{currentGuessIndex}{" "}
          </h2>
        </span>
        <img className="w-full" src={gameData.house.images[0]} alt="" />

        <form
          onSubmit={handleGuess}
          className="rounded-xl rounded-t bg-gray-200"
        >
          <span className="flex flex-col p-4">
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <input
                {...register("guess", { required: true })}
                placeholder="enter the price"
                className="w-full rounded-lg border-2 border-gray-300 py-2 pl-10 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>

            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                onClick={handleGoBackToLastGuess}
                className="flex-1 border bg-gray-500 p-2"
              >
                LEFT{" "}
              </button>
              <button
                type="submit"
                className="flex-[3] bg-green-700 p-2 text-2xl text-white"
              >
                Guess
              </button>
              <button
                type="button"
                onClick={handleGoToNextGuess}
                className="flex-1 border bg-gray-500 p-2"
              >
                RIGHT
              </button>
            </div>
          </span>
        </form>
      </div>
    </div>
  );
}
