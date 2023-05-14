import React, { use, useEffect, useState } from "react";
import { InputBar } from "~/components/InputBar";
import { ProgressBar } from "~/components/ProgressBar";
import { set, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import json from "../../house.json";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BsCaretDownFill, BsCaretUpFill, BsZoomIn } from "react-icons/bs";
import ProgressBar2 from "~/components/progressBarV2";

type FormValues = {
  guess: string;
};

interface gameData {
  guesses: guessObject[];
  house: House;
}

interface guessObject {
  guess: string;
  result?: string;
}

type House = {
  price: number;
  listingurl: string;
  name: string;
  presentedBy: string;
  location: string;
  rooms: number;
  size: number;
  buildingYear: number;
  images: string[];
};

// create json for a house listing which has a price, the image below anda bunch of rooms for that house

export default function Game() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [gameData, setGameData] = useState<gameData>({
    guesses: [],
    house: json,
  });
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [showClueBox, setShowClueBox] = useState<boolean>(false);
  const router = useRouter();

  const handleGuess = handleSubmit((data) => {
    const res = handleCompareGuessToPrice(data.guess);
    let guessObject: guessObject = { guess: data.guess };
    if (res === 1) {
      // append "Too high" to the guessess array
      guessObject.result = "Too high";
    } else if (res === -1) {
      // append "Too low" to the guessess array
      guessObject.result = "Too low";
    } else if (res === 0) {
      // append "Correct" to the guessess array
      guessObject.result = "Correct";
    }

    setGameData((prevGameData) => {
      const newGameData = {
        guesses: [...prevGameData.guesses, guessObject],
        house: prevGameData.house,
      };

      localStorage.setItem("guessess", JSON.stringify(newGameData.guesses));

      return newGameData;
    });

    setCurrentGuessIndex((prevIndex) => prevIndex + 1);
  });

  // -1 for too low, 0 for correct, 1 for too high
  function handleCompareGuessToPrice(guess: string): number {
    const guess1 = Number(guess);
    const price = gameData.house.price;

    if (guess1 === price) {
      alert("You guessed correctly!");
      return 0;
    } else if (guess1 > price) {
      alert("Your guess is too high!");
      // append "Too high" to the guessess array
      return 1;
    } else if (guess1 < price) {
      alert("Your guess is too low!");
      return -1;
    }

    return 0;
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
    const guesses = localStorage.getItem("guessess");
    if (guesses) {
      setGameData((prevGameData) => {
        const newGameData = {
          guesses: JSON.parse(guesses),
          house: prevGameData.house,
        };
        return newGameData;
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
      void router.push("/results").then().catch(null);
    }
  }, [gameData.guesses]);

  // styling for button, if its impossible to go back further, then disable the button
  // if its impossible to go forward, then disable the button
  const handleBackButtonStyle = (currentGuessIndex: number) => {
    if (currentGuessIndex === 0) {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-black py-2 text-center opacity-20 cursor-not-allowed";
    } else {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-black py-2 text-center hover:bg-slate-400 ";
    }
  };

  const handleRightButtonStyle = (currentGuessIndex: number) => {
    if (currentGuessIndex === gameData.guesses.length) {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-black py-2 text-center opacity-20 cursor-not-allowed";
    } else {
      return "flex h-full flex-1 items-center justify-center rounded-xl border-2 border-slate-900 py-2 text-center hover:bg-slate-400";
    }
  };

  return (
    <div className="z-0 flex h-screen items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-950  to-slate-900 font-mono">
      <div className="flex w-[33rem] flex-col justify-evenly gap-5 ">
        <span className="flex flex-col gap-4 ">
          <ProgressBar2 progress={((currentGuessIndex + 1) / 6) * 100} />
          <h2 className="text-4xl font-bold text-amber-300">
            CLUE #{currentGuessIndex + 1}{" "}
          </h2>

          <p className="text-xl font-medium text-white">
            {handleGetClue(currentGuessIndex)}
          </p>
        </span>

        <span className="rounded-sm shadow-md shadow-purple-500/50">
          <img
            className=" w-full rounded-sm object-cover "
            src={gameData.house.images[currentGuessIndex]}
            alt=""
          />
        </span>
        <div className="flex items-center justify-center">
          <button
            className="flex items-center justify-between gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white"
            onClick={() => setShowImage(true)}
          >
            <p>Zoom</p>
            <BsZoomIn className="text-lg" />
          </button>
        </div>
        <Dialog
          className=""
          open={showImage}
          onClose={() => setShowImage(false)}
        >
          <div className="fixed inset-0 z-10 flex w-full items-center justify-center">
            <div className="absolute right-0 top-0 m-2">
              <button
                className="rounded-full p-2 text-gray-500  hover:text-gray-700"
                onClick={() => setShowImage(false)}
              >
                <ImCross className="text-4xl text-white" />
              </button>
            </div>
            <div className="flex w-[80%] items-center justify-center rounded-lg ">
              <img
                src={gameData.house.images[currentGuessIndex]}
                alt=""
                className="max-h-full max-w-full"
              />
            </div>
          </div>
          <Dialog.Overlay
            onClick={() => setShowImage(false)}
            className="fixed inset-0 z-0 bg-black opacity-70"
          />
        </Dialog>

        <Transition
          is="fragment"
          show={true}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {currentGuessIndex === gameData.guesses.length ? (
            <div className="relative  ">
              <Transition
                className="absolute bottom-[155px] left-0 right-0 "
                show={showClueBox}
                enter="transition duration-500 ease-in-out transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition duration-500 ease-in-out transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <button
                  className="flex  w-full justify-center bg-purple-700 hover:bg-purple-800"
                  onClick={() => setShowClueBox(false)}
                >
                  <BsCaretDownFill className="text-2xl text-white" />
                </button>
                <div className="   h-full w-full bg-slate-800 ">
                  {gameData.guesses.map((guess, index) => {
                    return (
                      <div className="flex cursor-pointer items-center justify-between border-b border-slate-500 p-2 ">
                        <span className=" p-2 text-2xl font-bold text-yellow-300">
                          Guess #{index + 1}
                          <p className="items-center  text-xl font-light text-white">
                            {Number(guess.guess)}{" "}
                          </p>
                        </span>
                        <span className="rounded-lg bg-purple-400 ">
                          <p className="p-2 text-xl font-medium text-white">
                            {" "}
                            {guess.result}
                          </p>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Transition>

              <form
                key="guess-form"
                onSubmit={handleGuess}
                className=" rounded-xl rounded-t bg-gray-200"
              >
                {!showClueBox ? (
                  <button
                    className="flex  w-full justify-center bg-purple-700 hover:bg-purple-800"
                    onClick={() => setShowClueBox(true)}
                  >
                    <BsCaretUpFill className="text-2xl text-white" />
                  </button>
                ) : (
                  <></>
                )}

                <span className="flex flex-col p-4">
                  <div className="relative flex items-center space-x-2">
                    <span className="absolute inset-y-0 left-0 flex items-center justify-center px-5 py-4 text-2xl font-light   text-black">
                      SEK
                    </span>
                    <input
                      {...register("guess", { required: true })}
                      placeholder="xxx"
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
                      className="flex-[6] rounded-md bg-slate-800 py-2 text-4xl text-white hover:bg-slate-900"
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
            </div>
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
                    className="flex-[6] rounded-md bg-slate-800 py-2 text-3xl text-white"
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
