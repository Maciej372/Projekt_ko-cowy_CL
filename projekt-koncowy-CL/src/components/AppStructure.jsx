import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "./UsersLists";
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
    <div style={styles.container}>
      <div style={styles.menu}>
        {/* <button style={styles.button} onClick={onAddClick}>
          Dodaj
        </button> */}
        <button style={styles.button} onClick={onCalendarClick}>
          Kalendarz
        </button>
        <button style={styles.button} onClick={onListClick}>
          Lista podopiecznych
        </button>
        {/* <button style={styles.button} onClick={onArchiveClick}>
          Archiwum
        </button> */}
        {/* <button style={styles.button} onClick={onPricingClick}>
          Cennik
        </button> */}
        <button style={styles.button} onClick={onLogutClick}>
          Wyloguj
        </button>
      </div>
      {showCalendar ? <Calendar /> : <UserTable />}{" "}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#808080",
    padding: "10px 0",
  },
  menu: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "none",
    borderRadius: "0",
    cursor: "pointer",
    margin: "0 10px",
    transition: "background-color 0.3s ease",
  },
};

export default MainMenu;
