"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { RiMenu3Fill } from "react-icons/ri";

export default function CategoryMenu() {
  return (
    <Dropdown className="">
      <DropdownTrigger className="text-white lg:hidden block transition duration-50 hover:scale-125 text-2xl absolute right-20 inset-y-4">
        <Button variant="bordered">
          <RiMenu3Fill />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        className="text-white text-xl bg-black rounded-lg leading-9 p-3"
      >
        <DropdownItem
          key="xbox"
          className="hover:scale-110 hover:text-zinc-400 transition duration-100"
        >
          Xbox
        </DropdownItem>
        <DropdownItem
          key="ps"
          className="hover:scale-110 hover:text-zinc-400 transition duration-100"
        >
          Playstation
        </DropdownItem>
        <DropdownItem
          key="nintendo"
          className="hover:scale-110 hover:text-zinc-400 transition duration-100"
        >
          Nintendo
        </DropdownItem>
        <DropdownItem
          key="e-games"
          className="hover:scale-110 hover:text-zinc-400 transition duration-100"
        >
          Epic Games
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
