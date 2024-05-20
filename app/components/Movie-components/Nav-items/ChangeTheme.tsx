"use client";
import { useState } from "react";
import { CiSun } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";

const changeTheme = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleDarkTheme = () => {
    const body = document.querySelector("body") as HTMLBodyElement;

    if (!isDark) {
      //An eimaste se light theme molis o xrhsths pataei to koumpi tote ginetai dark theme kai mpainoun ta antistoixa styles sto body
      if (body) {
        body.classList.add("text-white");
        body.classList.add("body-dark");
        body.classList.remove("text-black");
        body.classList.remove("body-light");
        body.style.backgroundColor = "#49243E";

        setIsDark(true);
      }
    } else {
      //An eimaste se dark theme molis o xrhsths pataei to koumpi tote ginetai light theme kai mpainoun ta antistoixa styles sto body
      if (body) {
        body.classList.add("text-black");
        body.classList.add("body-light");
        body.classList.remove("text-white");
        body.classList.remove("body-dark");
        body.style.backgroundColor = "#EEE3CB";
      }
      setIsDark(false);
    }
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
