import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "./UserTable";
import Calendar from "./Calendar";

const MainMenu = () => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);

  const onLogutClick = () => {
    navigate("/");
  };

  const onCalendarClick = () => {
    setShowCalendar(true);
  };

  const onListClick = () => {
    setShowCalendar(false);
  };

  return (
    <div className="bg-gray-800 min-h-screen min flex flex-col justify-center items-center">
      <div className="w-full max-w-screen-lg p-4">
        <div className="flex justify-evenly items-center mb-2">
          <button
            onClick={onCalendarClick}
            className={`text-white px-4 py-2 rounded-md ${
              !showCalendar ? "bg-orange-500" : "bg-transaprent"
            } hover:bg-orange-600 transition duration-300`}
          >
            Kalendarz
          </button>
          <button
            onClick={onListClick}
            className={`text-white px-4 py-2 rounded-md ${
              !showCalendar ? "bg-transparent" : "bg-orange-500"
            } hover:bg-orange-600 transition duration-300`}
          >
            Lista
          </button>
          {/* <button style={styles.button} onClick={onArchiveClick}>
            Archiwum
          </button> */}
          {/* <button style={styles.button} onClick={onPricingClick}>
            Cennik
          </button> */}
          <button
            onClick={onLogutClick}
            className="text-white px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition duration-300"
          >
            Wyloguj
          </button>
        </div>
        {showCalendar ? <Calendar /> : <UserTable />}
      </div>
    </div>
  );
};

export default MainMenu;
