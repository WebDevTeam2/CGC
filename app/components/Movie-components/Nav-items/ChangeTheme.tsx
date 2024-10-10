// ChangeTheme.js
"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { CiSun } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";

const ChangeTheme = () => {
  const { isDark, toggleDarkTheme } = useTheme();

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

export default ChangeTheme;
