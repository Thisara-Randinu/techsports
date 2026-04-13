"use client";

import { MouseEvent, useState } from "react";

function submit(e: MouseEvent<HTMLButtonElement>, amount: number) {
  e.preventDefault();
  console.log(amount);
}

export default function Pay() {
  const [amount, setAmount] = useState<number>(0);
  return (
    <>
      <div>
        <h1 className="text-center text-2xl">
          Make your Techsports Payment with ease through our official website
        </h1>
        <div className="flex flex-row">
          <p className="p-8">USD</p>
          <input
            id="submit_button"
            type="number"
            placeholder="Enter the amount"
            className="border-black-8"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <button type="submit" onClick={(e) => submit(e, amount)}>
          Submit
        </button>
      </div>
    </>
  );
}
