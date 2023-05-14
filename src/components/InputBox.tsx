import React from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface GuessFormProps {
  currentGuessIndex: number;
  gameData: any;
  handleGuess: any;
  handleGoBackToLastGuess: any;
  handleGoToNextGuess: () => void;
  handleBackToCurrentGuess: () => void;
  registerprop: any;
}

export function GuessForm(props: GuessFormProps) {
  const {
    currentGuessIndex,
    gameData,
    handleGuess,
    handleGoBackToLastGuess,
    handleGoToNextGuess,
    handleBackToCurrentGuess,
    registerprop,
  } = props;

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
    <form
      key={
        currentGuessIndex === gameData.guesses.length
          ? "guess-form"
          : "current-guess-form"
      }
      onSubmit={
        currentGuessIndex === gameData.guesses.length
          ? handleGuess
          : handleBackToCurrentGuess
      }
      className="rounded-xl rounded-t bg-gray-200"
    >
      <span className="flex flex-col p-4">
        {currentGuessIndex === gameData.guesses.length ? (
          <div className="relative flex items-center space-x-2">
            <span className="absolute inset-y-0 left-0 flex items-center justify-center px-5 py-4 text-2xl font-light text-black">
              SEK
            </span>
            <input
              placeholder="42069kr"
              className="w-full rounded-lg border-2 border-gray-300 py-2 pl-10 pr-3 text-center text-2xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
              {...(registerprop("guess"), { required: true })}
            />
          </div>
        ) : null}
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
            {currentGuessIndex === gameData.guesses.length
              ? "Guess"
              : "BACK TO GUESSING"}
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
  );
}

export default GuessForm;
