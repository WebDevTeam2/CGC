"use client";
import { useState } from "react";
import { CiSun } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";

const changeTheme = () => {
  let counter = 0;
  const [isDark, setIsDark] = useState(false);
  const toggleDarkTheme = () => {
  const body = document.querySelector("body") as HTMLBodyElement; 
  const cards = document.querySelectorAll('.cards') as NodeListOf<HTMLElement>  

    if (!isDark) {
      if (body) {
        counter < 1
          ? (body.className +=
              " transition duration-200 ease-in-out text-white")
          : (body.classList.add("text-white"),
            body.classList.remove("text-black"));
        body.style.backgroundColor = "#49243E";
        cards.forEach((card) => {
          card.style.backgroundColor = "#704264";
        });
        setIsDark(true);
      }
    } else {
      if (body) {
        body.classList.remove("text-white");
        body.classList.add("text-black");
        body.style.backgroundColor = "#EEE3CB";
        cards.forEach((card) => {
          card.style.backgroundColor = "#4c545b";
        });
      }
      setIsDark(false);
    }
    counter++;
  };

  return (
    <button className="ml-6 mb-6" onClick={toggleDarkTheme}>
      {!isDark ? (
        <CiSun
          style={{
            color: "#d5d532",
            visibility: "visible",
            fontSize: "2rem",
          }}
        />
      ) : (
        <IoMoon
          style={{
            color: "#b6b6b6",
            visibility: "visible",
            fontSize: "2rem",
          }}
        />
      )}
    </button>
  );
};

export default changeTheme;
