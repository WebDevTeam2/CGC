"use client";
//components
import HomePage from "@/app/Components/Movie-components/Nav-items/HomePage";
import Random from "@/app/Components/Movie-components/Nav-items/Random";
import Trending from "@/app/Components/Movie-components/Nav-items/Trending";
import MovieHomePage from "@/app/Components/Movie-components/Nav-items/MovieHomePage";
import ChangeTheme from "./Nav-items/ChangeTheme";
import Search from "./Nav-items/Search";
import TVShowHomePage from "@/app/Components/Movie-components/Nav-items/TVShowsHomePage";
import UpComing from "@/app/Components/Movie-components/Nav-items/UpComing";

//utils and icons
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Login from "./Nav-items/Login";
import { useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0); //Variable that initializes the user's scroll to 0
  
  //Used for the scrolling in nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY; //CurrentScrollPos is the position of the user's scroll
      const isSmallScreen = window.innerWidth < 1024; //Check if the screen is smaller than 1024px

      //If the user has scrolled down and the screen is smaller than 1024px then we hide the nav using a custom css class
      if (isSmallScreen)
        currentScrollPos > prevScrollPos
          ? document.getElementById("scroll-nav")?.classList.add("hide-nav")
          : document.getElementById("scroll-nav")?.classList.remove("hide-nav");

      setPrevScrollPos(currentScrollPos); //We update the currentScroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (session?.user?.email) {
        try {
          // Fetch the profile picture 
          const response = await fetch(
             `/api/getUserDetails/${session.user.email}`, {
              method:"GET"
             }
          );

          if (!response.ok) {
            console.error("Error fetching user details:", response.statusText);
            return;
          }

          // Parse the response as JSON
          const data = await response.json();

          // Check if the data contains a valid id
          if (data?._id) {
            setUser(data);
          } else {
            console.log("No profile found for this user.");
          }
        } catch (error) {
          console.error("Failed to fetch profile details:", error);
        }
      }
    };

    fetchProfileDetails();
  }, [session?.user?.email]); // Only re-run this effect if the session changes


  //This is used to toggle the search bar to visible when a user clicks it from the navBar
  const toggleSearch = () => {
    setSearchVisible(true);
  };

  //This useEffect is used to blur the other elements when the search bar is visible
  useEffect(() => {
    const blur = document.querySelectorAll(".not-search");
    const navForHover = document.querySelector(".nav-for-hover");
    const dummy = document.querySelector(".dummy-class"); //dummy is a class used to target the nav when navForHover is removed

    if (searchVisible) {
      navForHover ? navForHover.classList.remove("nav-for-hover") : null; //If search has been clicked then we remove the class nav-for-hover so that the nav returns to its original position

      //We add the blurred class to the elements that we want to blur
      blur.forEach((e) => {
        e.classList.add("blurred");
        e.classList.add("pointer-events-none"); //We remove the pointer events so that the user will only be able to target the Search bar
      });
    }
    //If search is not open we restore the original state of the elements
    else {
      blur.forEach((e) => {
        e.classList.remove("blurred");
        e.classList.remove("pointer-events-none");
      });

      dummy ? dummy.classList.add("nav-for-hover") : null; //We allow the nav to be hoverable again
    }
  }, [searchVisible]);

  return (
    <div className="nav-for-hover dummy-class">
      <nav
        id="scroll-nav"
        className="lg:w-20 lg:h-full sm:w-full overflow-auto overflow-x-auto fixed bg-[#23232e] sm:z-10 sm:bottom-0 lg:hover:w-56 group duration-700 ease-in-out not-search navbar"
      >
        <ul className="flex sm:flex-row lg:flex-col items-center p-0 m-0 h-full not-search">
          <li className="text-[#b6b6b6] text-l w-full transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <HomePage />
          </li>
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <MovieHomePage />
          </li>
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <TVShowHomePage />
          </li>
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <Trending />
          </li>
          <li
            onClick={toggleSearch}
            className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none"
          >
            <Link
              href={"#"}
              className="flex flex-row items-center h-20 gap-2 not-search"
            >
              <FaMagnifyingGlass
                style={{ margin: "0 1.5rem", flexShrink: 0 }}
              />
              <span className="sm:block md:block lg:hidden transition duration-700 ease-in-out ml-2 not-search">
                {" "}
                Search
              </span>
            </Link>
          </li>
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <Random />
          </li>
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <UpComing />
          </li>
          {/* If we have a user session then we display his profile picture */}
          {session ? (
            <li className="text-[#b6b6b6] text-l h-20 w-full transition duration-500 ease-in-out not-search image-li">
              <Link
                href={`/Account/info/`}
                className="relative w-10 h-10 md:mt-5 lg:mt-2 mx-[1.05rem] block rounded-full overflow-hidden"
              >
                <img
                  src={user?.profilePicture || "/assets/images/batman.jpg"} // An o xrhsths exei diko tou image to kanoume display alliws kanoume display ena default
                  alt="User Avatar"
                  className="object-cover w-full h-full absolute"
                />
              </Link>
            </li>
          ) : (
            // Otherwise we display the option to signup/login
            <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto">
              <Login />
            </li>
          )}
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <ChangeTheme />
          </li>
        </ul>
      </nav>

      {/*  This must be placed outside of the navbar otherwise it is shown in the navbar list when opened instead of the center of the page */}
      {searchVisible && <Search setSearchVisible={setSearchVisible} />}
    </div>
  );
}