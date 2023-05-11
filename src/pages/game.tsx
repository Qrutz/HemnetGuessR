import React, { useEffect, useState } from "react";
import { InputBar } from "~/components/InputBar";
import { ProgressBar } from "~/components/ProgressBar";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import json from "../../house.json";

type cringedata = {
  guess: number;
};

// create json for a house listing which has a price, the image below anda bunch of rooms for that house

interface guess {
  guess: number;
  status: string;
}

export default function game() {
  const { register, handleSubmit, watch } = useForm<cringedata>();
  const [price, setPrice] = useState<number>(json.price);
  const [bestGuess, setBestGuess] = useState<guess>();
  const [clueN, setClueN] = useState<number>(1);
  const [guesses, setGuesses] = useState<guess[]>([]);
  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    // create switch, if data.guess is higher than price print higher
    // if data.guess is lower than price print lower
    // if data.guess is equal to price print correct
    switch (true) {
      case data.guess > price:
        console.log("lower");
        guesses.push({ guess: data.guess, status: "Too High" });
        break;
      case data.guess < price:
        console.log("higher");
        guesses.push({ guess: data.guess, status: "Too Low" });

        break;
      case data.guess == price:
        console.log("correct");
        alert("end game");
        break;
      default:
        console.log("error");
        break;
    }

    setClueN(clueN + 1);
  });

  // method to check if guess is the best guess so far
  //   function checkBestGuess() {
  //     // check if guesses is empty
  //     if (guesses == null || guesses == undefined) {
  //       return;
  //     }

  //     if (guesses.length == 0) {
  //       setBestGuess(guesses[0]);
  //     } else {
  //       if (guesses[guesses.length - 1].guess < bestGuess.guess) {
  //         setBestGuess(guesses[guesses.length - 1]);
  //       }
  //     }
  //   }

  // create function to determine which room to show based on guessess
  function showRoom() {
    if (clueN == 1) {
      return json.image;
    } else if (clueN == 2) {
      return json.rooms[0]?.image;
    } else if (clueN == 3) {
      return json.rooms[1]?.image;
    } else if (clueN == 4) {
      return json.rooms[2]?.image;
    } else if (clueN == 5) {
      return json.rooms[3]?.image;
    } else if (clueN == 6) {
      return json.rooms[4]?.image;
    }
  }

  useEffect(() => {
    console.log(clueN);
    if (clueN == 7) {
      router.push("/results");
    }
  }, [clueN]);

  return (
    <div className="flex h-screen items-center justify-center bg-green-800">
      <div className="flex flex-col justify-between space-y-9 ">
        {clueN}
        <ProgressBar progress={(clueN / 6) * 100} />
        <div className="">
          {json.rooms[clueN - 2]?.name}
          <img className=" w-fit" src={showRoom()} alt="" />
          <div className="mt-2 flex flex-col">
            <div className="h-full w-full bg-yellow-200">
              <span className="flex justify-between px-4 py-4">
                <h2>Guess</h2>
                <h2>Status </h2>
              </span>
              {guesses.map((guess) => (
                <div className="flex justify-between px-4 py-4">
                  <h2>{guess.guess}</h2>
                  <h2>{guess.status}</h2>
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="bg-gray-200">
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
                  <button className="flex-1 border bg-gray-500 p-2">
                    LEFT{" "}
                  </button>
                  <button
                    type="submit"
                    className="flex-[3] bg-green-700 p-2 text-2xl text-white"
                  >
                    Guess
                  </button>
                  <button className="flex-1 border bg-gray-500 p-2">
                    RIGHT
                  </button>
                </div>
              </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
