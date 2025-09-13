"use client";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { useRouter, usePathname } from "next/navigation";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

function Header() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const newTrip = () => {
    setIsLoading(true);
    router.push("/create-new-trip");
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black/40">
        <PulseLoader color="orange" size={15} />
        <p className="text-white mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-4 px-5">
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
        <h2 className="text-xl font-bold">Planora</h2>
      </div>

      {/* Menu Options */}
      <div className="md:flex hidden items-center gap-8">
        {menuOptions.map((option, index) => (
          <Link key={index} href={option.path}>
            <h2 className="cursor-pointer text-lg hover:scale-105 hover:text-primary transition-all">
              {option.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* Get Started / Create Trip */}
      {!user ? (
        <SignInButton mode="modal">
          <Button className="text-white">Get Started</Button>
        </SignInButton>
      ) : (
        pathname !== "/create-new-trip" && (
          <Button className="text-white" onClick={newTrip}>
            Create New Trip
          </Button>
        )
      )}
    </div>
  );
}

export default Header;