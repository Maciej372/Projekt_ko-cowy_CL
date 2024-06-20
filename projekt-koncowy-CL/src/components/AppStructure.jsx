import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "./UserTable";
import Calendar from "./Calendar";
import UserDetails from "./StudentInfo";

const MainMenu = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("userTable");

  const onLogoutClick = () => {
    navigate("/");
  };

  const onCalendarClick = () => {
    setCurrentView("calendar");
  };

  const onListClick = () => {
    setCurrentView("userTable");
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-screen-lg p-4">
        <div className="flex justify-evenly items-center mb-2">
          <button
            onClick={onCalendarClick}
            className={`text-white px-4 py-2 rounded-md ${
              currentView === "calendar" ? "hidden" : "bg-orange-500"
            } hover:bg-orange-600 transition duration-300`}
          >
            Kalendarz
          </button>
          <button
            onClick={onListClick}
            className={`text-white px-4 py-2 rounded-md ${
              currentView === "userTable" ? "hidden" : "bg-orange-500"
            } hover:bg-orange-600 transition duration-300`}
          >
            Lista
          </button>
          <button
            onClick={onLogoutClick}
            className="text-white px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition duration-300"
          >
            Wyloguj
          </button>
        </div>
        {/* Renderowanie komponentów na podstawie stanu */}
        {currentView === "calendar" && <Calendar />}
        {currentView === "userTable" && <UserTable />}
        {currentView === "userDetails" && <UserDetails />}
      </div>
    </div>
  );
};

export default MainMenu;
