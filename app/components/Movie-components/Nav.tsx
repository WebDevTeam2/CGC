"use client";
//components
import HomePage from "@/app/components/Movie-components/Nav-items/HomePage";
import Random from "@/app/components/Movie-components/Nav-items/Random";
import Trending from "@/app/components/Movie-components/Nav-items/Trending";
import MovieHomePage from "@/app/components/Movie-components/Nav-items/MovieHomePage";
import ChangeTheme from "./Nav-items/ChangeTheme";
import Search from "./Nav-items/Search";
import TVShowHomePage from "@/app/components/Movie-components/Nav-items/TVShowsHomePage";
import UpComing from "@/app/components/Movie-components/Nav-items/UpComing";

//utils and icons
import React, { useEffect, useState } from "react";
import { findUserByEmail } from "@/app/collection/connection";
import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Login from "./Nav-items/Login";
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";

//Ena array apo objects me diaforetiko id gia na mhn epanalamvanetai o kwdikas polles fores

export default function Nav() {
  const { data: session } = useSession();
  const [searchVisible, setSearchVisible] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>("");  
  const [prevScrollPos, setPrevScrollPos] = useState(0); //Metavlhth pou arxikopoiei to scroll pou kanei o xrhsths se 0

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (session?.user?.email) {
        try {
          // Fetch the profile picture using the email as a query param
          const response = await fetch(
            `/api/getUserDetails?email=${session.user.email}`
          );

          if (!response.ok) {
            console.error("Error fetching user details:", response.statusText);
            return;
          }

          // Parse the response as JSON
          const data = await response.json();

          // Check if the data contains a valid id
          if (data?._id) {
            setImageUrl(data.profilePicture); // Set the imageUrl state to the saved profile picture
            setUserId(data._id);            
          } else {
            console.log("No profile found for this user.");
          }
        } catch (error) {
          console.error("Failed to fetch profile details:", error);
        }
      }
    };

    fetchProfileDetails();
  }, [session?.user?.email]); // Only re-run this effect if the session changes\
  //Gia to control tou nav sto scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY; //To torino scroll einai to poso scroll exei ginei apo ton xrhsth
      const isSmallScreen = window.innerWidth < 1024; //Metavlhth pou elegxei to megethos ths othonhs

      //An exoume kanei scroll tote vazoume ena class hide-nav pou exei kapoia css styles
      if (isSmallScreen)
        currentScrollPos > prevScrollPos
          ? document.getElementById("scroll-nav")?.classList.add("hide-nav")
          : document.getElementById("scroll-nav")?.classList.remove("hide-nav");

      setPrevScrollPos(currentScrollPos); //Kanoume update to position tou previous scroll
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  //Gia to searchbar otan to epilegei o xrhsths apo to navbar
  const toggleSearch = () => {
    setSearchVisible(true); //An kanoume click to search tote to searchbar ginetai visible
  };

  //Xrhsh useEffect epeidh h react xrhsimpoioei asyncronus updates, an to blur mpei sto toggleSearch kanei to searchVisivle na einai true kai vazei to onoma ths klasshs, alla den prolavainei na kanei render ta styles kai xreiazetai kai 2o click
  useEffect(() => {
    const blur = document.querySelectorAll(".not-search");
    const navForHover = document.querySelector(".nav-for-hover");
    const dummy = document.querySelector(".dummy-class");
    const body = document.querySelector("body") as HTMLBodyElement;

    if (searchVisible) {
      navForHover ? navForHover.classList.remove("nav-for-hover") : null; //An exei epilexthei to search aferw to class pou kanw target sto CSS gia ta hover effects

      blur.forEach((e) => {
        //Dialegoume ola ta classes me to onoma not-search kai ta dinoume mia kainourgia classh pou thn kanoume target me CSS
        e.classList.add("blurred");
        e.classList.add("pointer-events-none"); //Otan ginetai click gia to search theloume na mporei o xxrhsths na kanei target mono ayto
      });
    }
    //Otan den einai epilegmeno to search ta epanaferoume sto arxiko
    else {
      blur.forEach((e) => {
        e.classList.remove("blurred");
        e.classList.remove("pointer-events-none");
      });

      dummy ? dummy.classList.add("nav-for-hover") : null; //An to dummy class yparxei prothetoume xana to nav-for-hover
    }
  }, [searchVisible]);

  return (
    // Ena wrapper div etsi wste to searchbar na mhn einai mesa sto navbar
    <div className="nav-for-hover dummy-class">
      <nav
        id="scroll-nav"
        className="lg:w-20 lg:h-full sm:w-full overflow-x-auto overflow-y-hidden fixed bg-[#23232e] sm:z-10 sm:bottom-0 lg:hover:w-56 group duration-700 ease-in-out not-search navbar"
      >
        <ul className="flex sm:flex-row lg:flex-col items-center p-0 m-0 h-full not-search">
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
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
          {/* An yparxei session tote vazoume na fainetai h eikona tou xrhsth  */}
          {session ? (
            <li className="text-[#b6b6b6] text-l h-20 w-full transition duration-500 ease-in-out not-search image-li">
              <Link
                href={`/account/${userId}/info/`}
                className="relative w-10 h-10 md:mt-5 lg:mt-2 mx-[1.05rem] block rounded-full overflow-hidden"
              >
                <Image
                  src={imageUrl || "/assets/images/batman.jpg" } // An o xrhsths exei diko tou image to kanoume display alliws kanoume display ena default
                  alt="User Avatar"
                  layout="fill"
                  className="object-cover"
                />
              </Link>
            </li>
          ) : (
            // An den yparxei session tote vazoume na fainetai to login
            <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto">
              <Login />
            </li>
          )}
          <li className="text-[#b6b6b6] text-l w-full [&:not(:last-child)]:hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search last:mt-auto last:hover:none">
            <ChangeTheme />
          </li>
        </ul>
      </nav>

      {/* ektos tou nav giati alliws to search bar emfanizetai dipla apo to li pou einai to search kai oxi sth mesh ths selidas */}
      {searchVisible && <Search setSearchVisible={setSearchVisible} />}
    </div>
  );
}
