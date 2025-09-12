"use client"
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs"; // Add this import
import Image from "next/image";
import Link from "next/link";
import React from "react";

const menuOptions = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Pricing", 
    path: "/pricing",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
];

function Header (){
  const { user } = useUser(); // Add this line

  return (
    <div className="flex justify-between items-center py-4">
      {/* Logo... */}
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
        <h2 className="text-xl font-bold">Planora</h2>
      </div>

      {/* Menu Options... */}
      <div className="flex items-center gap-8">
        {menuOptions.map((option, index) => (
          <Link key={index} href={option.path}>
            <h2 className="cursor-pointer text-lg hover:scale-105 hover:text-primary transition-all">{option.name}</h2>
          </Link>
        ))}
      </div>

      {/* Get Started... */}
      {!user ? <SignInButton mode='modal'>
        <Button className="text-white">Get Started</Button>
      </SignInButton> : 
      <Link href={'/create-new-trip'}>
        <Button>Create New Trip</Button>
        </Link>}
    </div>
  );
};

export default Header;
