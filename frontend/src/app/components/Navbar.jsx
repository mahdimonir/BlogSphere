"use client";
import { useAuth } from "@/context/AuthContext";
import { AlignJustify, Bell, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [model, setModel] = useState(false);
  const { user, token, login, logout } = useAuth();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem("Dark");
    if (isDark === "true") {
      setDark(true);
      document.body.classList.add("dark");
    } else {
      setDark(false);
      document.body.classList.remove("dark");
    }
  }, []);

  const modelHandler = () => {
    setModel(true);
  };

  const toggleTheme = () => {
    const nextTheme = !dark;
    setDark(nextTheme);
    localStorage.setItem("Dark", nextTheme ? "true" : "false");
    document.body.classList.toggle("dark", nextTheme);
  };

  return (
    <nav
      className="flex items-center sticky top-0 z-50  h-full justify-between  py-5
      shadow-xl bg-white dark:bg-[#1C1B1B]
        
        "
    >
      <div className="max-w-[1200px]  px-3   w-full mx-auto flex">
        <Link href="/" className="text-lg font-bold text-blue-500">
          BlogSphere
        </Link>

        <div className="relative mx-4 flex-1 max-w-[20rem]">
          <input
            type="text"
            placeholder="search blog"
            className="w-full rounded-full py-1 px-4 bg-gray-100 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <div className=" flex justify-end items-center ml-auto gap-5">
          <div className="w-[50px]  h-[23px]  overflow-hidden rounded-4xl shadow-inner-dark   relative  flex justify-center items-center  bg-gray-300 dark:bg-white">
            <div
              className={`absolute  flex items-center   w-full h-full transition-all  ${
                dark ? "translate-x-[20px] " : "left-0 inline"
              }`}
            >
              <button className=" absolute left-1 top-[2.5px]">
                <Moon
                  className="h-5 w-5 dark:hidden "
                  color="white"
                  onClick={() => toggleTheme()}
                />
              </button>
              <button className=" absolute dark:inline hidden left-0 top-[2px]">
                <Sun
                  className="h-5 w-5 "
                  color="gray"
                  onClick={() => toggleTheme()}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4  relative  justify-center">
            <AlignJustify
              className="md:hidden border  rounded-sm"
              color="white"
              onClick={modelHandler}
            />

            <div
              className={`  flex items-center md:justify-center pt-3 md:pt-0
                  gap-3 bg-white md:bg-transparent shadow flex-col 
                  md:flex-row fixed md:relative top-0 h-full
                 ${
                   model ? "right-0 " : "left-full "
                 } md:left-0 w-[10rem] md:w-auto `}
            >
              <X
                className="right-0 md:hidden text-red-500"
                onClick={() => setModel(false)}
              />
              {user ? (
                <>
                  <div className="relative bg-red-300">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      7
                    </span>
                  </div>
                  <Link href="/my-blogs" className="text-sm">
                    My blogs
                  </Link>
                  <Link href="/profile" className="text-sm">
                    Profile
                  </Link>
                  <Link
                    href="/logout"
                    onClick={() => logout()}
                    className="text-sm"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm  bg-blue-500 text-white text-center px-3  rounded-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm  text-center px-3 text-black dark:text-white    rounded-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
