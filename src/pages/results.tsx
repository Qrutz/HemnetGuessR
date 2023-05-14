import React, { useEffect, useState } from "react";
import house from "../../house.json";
import { IoShareOutline } from "react-icons/io5";
import { TfiGallery } from "react-icons/tfi";
import { useRouter } from "next/router";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { BsTwitter } from "react-icons/bs";

export default function Results() {
  const [bestGuess, setBestGuess] = useState<number>(0);
  const [win, setWin] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setBestGuess(getBestGuess());
    setWin(checkIfUserWon());
  }, []);

  useEffect(() => {
    // if guessess is not in local storage, router push to home
    if (!localStorage.getItem("guesses")) {
      router.push("/").then().catch(null);
    }
  }, []);

  function checkIfUserWon() {
    // get the price from the house.json file
    const bestGuess = getBestGuess();
    const price = house.price;
    // if bestGuess is +- 5% of the price, the user wins
    if (bestGuess >= price * 0.95 && bestGuess <= price * 1.05) {
      return true;
    }
    return false;
  }

  //create function to compare the guesses to the price and return the closest guess
  function getBestGuess(): number {
    // get the guesses from local storage
    const guesses = localStorage.getItem("guesses");
    // if there are no guesses, return 0
    if (!guesses) {
      return 0;
    }
    let closest = 0;
    //conver string to array of numbers,
    const guessArray = guesses.split(",").map(Number);
    console.log(guessArray);

    //loop through the array and compare the numbers to the price
    for (let i = 0; i < guessArray.length; i++) {
      const guess = guessArray[i];
      if (!guess) {
        continue;
      }
      // if the guess is closer to the price than the current closest, update the closest
      if (Math.abs(guess - house.price) < Math.abs(closest - house.price)) {
        closest = guess;
      }
    }
    // return the closest guess

    return closest;
  }

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-200 flex h-screen flex-col items-center justify-center  bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950  to-emerald-900 font-mono">
      <div className="w-[30rem] rounded-lg ">
        <div className="text-center text-white">
          {win ? (
            <h1 className="text-3xl font-bold ">You won!</h1>
          ) : (
            <span className="flex flex-col gap-2 py-4">
              <h1 className="text-xl font-semibold ">
                Todays Housle was a tough one!
              </h1>
              <p className="text-md font-semibold">You lost this round</p>
            </span>
          )}
          <div className="flex flex-col gap-4">
            <span className="rounded-full bg-white">
              <p className="p-3 text-xl font-bold">
                <span className="text-black">
                  {" "}
                  <span className="text-black">The price was: </span>{" "}
                  {house.price.toLocaleString() + "kr"}{" "}
                </span>
              </p>
            </span>
            <span className="rounded-full bg-white">
              <p className="p-3 text-xl font-bold">
                <span className="text-black">
                  {" "}
                  <span className="text-black">Best guess: </span>{" "}
                  {Number(bestGuess).toLocaleString()} kr
                </span>
              </p>
            </span>

            <p className="mx-4 text-center text-lg font-semibold text-white">
              Win Range: {Number(house.price * 0.95).toLocaleString()}kr -{" "}
              {Number(house.price * 1.05).toLocaleString()}kr
            </p>
          </div>
        </div>
        <div className="mt-4 flex  justify-center gap-3 rounded-lg bg-blue-600 p-4 text-2xl tracking-wide text-white">
          <TwitterShareButton
            url={`I just won hemnetChallenge with a score of ${bestGuess}!`}
            className=" flex w-full justify-center gap-2  "
          >
            <BsTwitter className="text-3xl" />
            <h2>SHARE ON TWITTER</h2>
          </TwitterShareButton>
        </div>

        <div className="mt-4 rounded-lg bg-white">
          <div className="grid grid-cols-2 grid-rows-2 gap-2 p-6">
            <span className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-t from-sky-400 to-cyan-300 text-white py-6">
              <h1>Games played</h1>
              <p className="text-4xl">1</p>
            </span>

            <span className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-t from-sky-400 to-cyan-300 text-white py-7">
              <h1>Win percentage</h1>
              <p className="text-4xl">0%</p>
            </span>

            <span className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-t from-sky-400 to-cyan-300 text-white py-6">
              <h1>Current streak</h1>
              <p className="text-4xl">0</p>
            </span>

            <span className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-t from-sky-400 to-cyan-300 text-white py-6">
              <h1>Max streak</h1>
              <p className="text-4xl">0</p>
            </span>

            <span className="flex flex-col items-center justify-center rounded-md bg-gradient-to-t from-sky-400 to-cyan-300 py-1">
              <button
                onClick={() => void router.push(house.listingurl)}
                className="p-2 text-lg text-white"
              >
                View Listing
              </button>
            </span>

            <span className="flex flex-col items-center justify-center rounded-md bg-gradient-to-t from-sky-400 to-cyan-300 py-1">
              <button
                onClick={() =>
                  void router.push(
                    "https://www.hemnet.se/bostader?housing_form_groups%5B%5D=vacation_homes&location_ids%5B%5D=924031"
                  )
                }
                className="p-2 text-lg text-white"
              >
                Similar Listings
              </button>
            </span>
          </div>

          <span className="flex flex-col justify-center space-y-4 py-2 text-center">
            <span className="flex justify-center  gap-2 ">
              <TfiGallery className="text-2xl" />
              <h1 className="text-md font-semibold ">Todays Image Gallery</h1>
            </span>
            <h1 className="text-md font-semibold ">
              Come Play Again Tomorrow!
            </h1>
          </span>
        </div>
      </div>
    </div>
  );
}
{
  /* {Number(bestGuess).toLocaleString()} kr */
}
