import React, { use, useEffect, useState } from "react";
import { InputBar } from "~/components/InputBar";
import { ProgressBar } from "~/components/ProgressBar";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import json from "../../house.json";
import { Transition } from "@headlessui/react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";

type FormValues = {
  guess: string;
};

interface gameData {
  guesses: string[];
  house: House;
}

type House = {
  price: number;
  name: string;
  presentedBy: string;
  location: string;
  rooms: number;
  size: number;
  buildingYear: number;
  images: string[];
};

// create json for a house listing which has a price, the image below anda bunch of rooms for that house

export default function game() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [gameData, setGameData] = useState<gameData>({
    guesses: [],
    house: json,
  });
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  const [clue, setClue] = useState<string>("");
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

    handleCompareGuessToPrice(data.guess);
    setCurrentGuessIndex((prevIndex) => prevIndex + 1);
  });

  function handleCompareGuessToPrice(guess: string) {
    const guess1 = Number(guess);
    const price = gameData.house.price;

    if (guess1 === price) {
      alert("You guessed correctly!");
    } else if (guess1 > price) {
      alert("Your guess is too high!");
    } else if (guess1 < price) {
      alert("Your guess is too low!");
    }
  }

  //get clue method, first clue corresponds to presentedBy, second to location, third to rooms
  function handleGetClue(clue: number): string {
    // if current guess index is 0, return presentedBy
    if (clue === 0) {
      return "Presented by: " + gameData.house.presentedBy;
    } else if (clue === 1) {
      return "Location: " + gameData.house.location;
    } else if (clue === 2) {
      return "Antal rum: " + gameData.house.rooms.toString();
    } else if (clue === 3) {
      return "sq feet: " + gameData.house.size.toString();
    } else if (clue === 4) {
      return "Buildyear: " + gameData.house.buildingYear.toString();
    } else if (clue === 5) {
      return gameData.house.name;
    } else {
      return "No more clues!";
    }
  }

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

  function handleBackToCurrentGuess() {
    setCurrentGuessIndex(gameData.guesses.length);
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
    reset({ guess: "" });
    setCurrentGuessIndex(gameData.guesses.length);
  }, [gameData.guesses]);

  //if guessess array length is 6 then redirect to results page
  useEffect(() => {
    if (gameData.guesses.length === 6) {
      saveGameDataToLocalStorage();
      router.push("/results");
    }
  }, [gameData.guesses]);

  // styling for button, if its impossible to go back further, then disable the button
  // if its impossible to go forward, then disable the button
  const handleBackButtonStyle = (currentGuessIndex: number) => {
    if (currentGuessIndex === 0) {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-black py-2 text-center opacity-20 cursor-not-allowed";
    } else {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-black py-2 text-center ";
    }
  };

  const handleRightButtonStyle = (currentGuessIndex: number) => {
    if (currentGuessIndex === gameData.guesses.length) {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-black py-2 text-center opacity-20 cursor-not-allowed";
    } else {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-black py-2 text-center";
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950  to-emerald-900 font-mono">
      <div className="flex h-full w-[33rem] flex-col justify-evenly ">
        <span className="flex flex-col gap-2 ">
          <ProgressBar progress={((currentGuessIndex + 1) / 6) * 100} />
          <h2 className="text-4xl font-bold text-amber-300">
            CLUE #{currentGuessIndex + 1}{" "}
          </h2>

          <p className="text-xl font-medium text-white">
            {handleGetClue(currentGuessIndex)}
          </p>
        </span>
        <img
          className="w-full"
          src={gameData.house.images[currentGuessIndex]}
          alt=""
        />

        <Transition
          is="fragment"
          show={true}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {currentGuessIndex === gameData.guesses.length ? (
            <form
              key="guess-form"
              onSubmit={handleGuess}
              className="rounded-xl rounded-t bg-gray-200"
            >
              <span className="flex flex-col p-4">
                <div className="relative flex items-center space-x-2">
                  <span className="absolute inset-y-0 left-0 flex items-center justify-center px-5 py-4 text-2xl font-light   text-black">
                    SEK
                  </span>
                  <input
                    {...register("guess", { required: true })}
                    placeholder="42069kr"
                    className="w-full rounded-lg border-2 border-gray-300 py-2 pl-10 pr-3 text-center text-2xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
                  />
                </div>

                <div className="flex w-full items-center justify-center gap-1 py-2">
                  <button
                    type="button"
                    onClick={handleGoBackToLastGuess}
                    className={handleBackButtonStyle(currentGuessIndex)}
                  >
                    <AiOutlineDoubleLeft className="text-4xl" />
                  </button>
                  <button
                    type="submit"
                    className="flex-[6] rounded-md bg-green-700 py-2 text-4xl text-white"
                  >
                    Guess
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToNextGuess}
                    className={handleRightButtonStyle(currentGuessIndex)}
                  >
                    <AiOutlineDoubleRight className="text-4xl" />
                  </button>
                </div>
              </span>
            </form>
          ) : (
            <form
              key="current-guess-form"
              onSubmit={handleBackToCurrentGuess}
              className="rounded-xl rounded-t bg-gray-200"
            >
              <span className="flex flex-col p-4">
                <div className="flex w-full items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={handleGoBackToLastGuess}
                    className={handleBackButtonStyle(currentGuessIndex)}
                  >
                    <AiOutlineDoubleLeft className="text-4xl" />
                  </button>

                  <button
                    type="submit"
                    className="flex-[6] rounded-md bg-green-700 py-2 text-3xl text-white"
                  >
                    BACK TO GUESSING
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToNextGuess}
                    className={handleRightButtonStyle(currentGuessIndex)}
                  >
                    <AiOutlineDoubleRight className="text-4xl" />
                  </button>
                </div>
              </span>
            </form>
          )}
        </Transition>
      </div>
    </div>
  );
}
