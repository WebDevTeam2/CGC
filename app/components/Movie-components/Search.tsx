"use client";
import React, { useEffect, useState, useRef } from "react";
import { movieTitles } from "../../constants/constants";

interface SearchProps {
  setSearchVisible: React.Dispatch<React.SetStateAction<boolean>>; //boolean
}

//Pernaw to setSearchVisible pou xrhsimpoiei to nav san props sto search
const Search: React.FC<SearchProps> = ({ setSearchVisible }) => {
  const [activeSearch, setActiveSearch] = useState<string[]>([]); //kanoume to activesSearch na arxikopoieitai san enas kenos pinakas apo strings
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    //Otan patame exw apo to input theloume na thwreteitai closed to searchbar
    const handler = (e: MouseEvent) => {
      const clickedOutsideSearch =
        searchRef.current && !searchRef.current.contains(e.target as Node);

      if (clickedOutsideSearch) {
        setOpen(false);
        setSearchVisible(false);
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [searchRef]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    //e.target.value einai to text pou grafoume sto searchbar
    //An einai keno tote epistrefei false kai de vazei kati ston pinaka
    if (e.target.value.trim().length === 0) {
      setActiveSearch([]);
      return false;
    }

    //Gemizoume ton pinaka me titlous tainiwn pou perilamvanoun to text pou grafoume sto searchbar kai epitrefoume ta 8 prwta apotelesmata
    setActiveSearch(
      movieTitles
        .filter((w) => w.toLowerCase().includes(e.target.value.toLowerCase()))
        .slice(0, 8)
    );
  };

  //Function gia na kanei autoComplete se periptwsh pou o xrhsths kanei click sto Span
  const handleAutoComplete = (selectedTitle: string) => {
    setTimeout(() => {  //Delay giati an feugei to div kateutheian kai kanw click panw se ena span, thewrei oti to click ginetai exw apo to div kai to search kleinei
      setActiveSearch([]);
    }, 100);

    const input = document.querySelector(".searchbar input");
    if (input) {
      (input as HTMLInputElement).value = selectedTitle;
    }
  };

  return (
    <form
      ref={searchRef}
      className="w-[440px] flex flex-col gap-2 absolute top-20 left-1/2 transform z-10 -translate-x-1/2 transition duration-700 ease-in-out searchbar"
    >
      <div className="relative">
        <input
          onChange={(e) => handleSearch(e)} //kaloume thn handleSearch otan allazei to input
          type="search"
          placeholder="Search..."
          className="w-full rounded-full text-[#d3d3d3] p-4 bg-slate-800"
        />
      </div>

      {/* An o pinakas den einai kenos tote emfanizoume ena div pou krataei mesa tis tainies pou tairiazoun me to text pou exoume grapsei sto searchbar */}
      {activeSearch.length > 0 && (
        <div className="w-full flex flex-col bg-slate-800 p-4 rounded-xl text-[#d3d3d3]">
          {
            activeSearch.map((s) => (
              <span
                key={s}
                onClick={() => handleAutoComplete(s)}
                className="hover:bg-[#6B6B6B] transition duration-700 ease-in-out cursor-pointer"
              >
                {s}
              </span>
            )) //Ta kanoume map kai vazoume ta apotelesmata mesa se xexwrista span. Kaloume sta span to autocomplete
          }
        </div>
      )}
    </form>
  );
};

export default Search;
