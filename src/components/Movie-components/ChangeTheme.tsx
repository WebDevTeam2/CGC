import { CiSun } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";

const changeTheme = () => {
  let counter = 0;
  let isDark = false;
  const toggleDarkTheme = () => {
    const body = document.querySelector("body");
    const animated = document.querySelector(".animated");
    const darkMode = document.querySelector(".theme-button");

    animated
      ? (animated.className += "rotate-360 transition transform ease-in-out")
      : null;

    if (!isDark) {
      if (body) {

        counter < 1 ? body.className += " transition duration-200 ease-in-out text-white animated " : (body.classList.add("text-white"), body.classList.remove("text-black"));
        body.style.backgroundColor = "black";
        

        setTimeout(() => {
          if (body) {
            body.classList.remove("animated");
          }
        }, 100);
        isDark = true;
      }
    } else {
      if (body) {
        body.classList.remove("text-white");
        body.classList.add("text-black");
        body.style.backgroundColor = "white";
      }
      isDark = false;
    }
    counter++;
  };

  return (
    <button
      onClick={toggleDarkTheme}
      className="bg-[#9a9a9a] rounded-full flex items-center justify-center min-w-16 cursor-pointer m-3 h-[5vh] theme-button"
    >
      <div className="bg-[#9a9a9a] transition transform duration-300 ease-in-out p-1 shadow-changeTheme mr-auto rounded-full ">
        <div className="w-full h-full flex items-center justify-center">
          <CiSun
            style={{
              color: "yellow",
              visibility: "visible",
              fontSize: "1.5rem",
            }}
          />
        </div>
      </div>
    </button>
  );
};

export default changeTheme;
