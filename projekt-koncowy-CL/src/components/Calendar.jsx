import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Lokalizator oparty na momencie
const localizer = momentLocalizer(moment);

const fetchAndTransformUsers = async (startDate) => {
  const url = `http://localhost:3000/users?startDate=${startDate}`;

  const response = await fetch(url);

  const users = await response.json();
  console.log("Dane użytkowników:", users);
  // Przekształcenie danych na wymagany format
  const transformedEvents = users.map((user) => {
    // Parsowanie daty
    const startDate = parseDate(user.start);
    return {
      id: user.id,
      title: `${user.name} ${user.surname}`,
      start: startDate,
      end: new Date(startDate.getTime() + 60 * 60 * 1000),
    };
  });

  return transformedEvents;
};

// Funkcja do parsowania daty w formacie "new Date(...)"
const parseDate = (dateString) => {
  // Usuń "new Date(" i ")" oraz podziel argumenty daty
  const dateArgs = dateString
    .replace("new Date(", "")
    .replace(")", "")
    .split(", ");

  // Utwórz nową datę z argumentów
  const parsedDate = new Date(
    parseInt(dateArgs[0]), // Rok
    parseInt(dateArgs[1]) - 1,
    parseInt(dateArgs[2]),
    parseInt(dateArgs[3]),
    parseInt(dateArgs[4])
  );

  return parsedDate;
};

const Calendar = () => {
  const [activities, setActivities] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // Ustawienie początkowej daty na bieżącą

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEvents = await fetchAndTransformUsers(currentDate);
      setActivities(fetchedEvents);
    };

    fetchData();
  }, [currentDate]); // Wywołanie efektu za każdym razem, gdy zmienia się currentDate

  const changeMonth = (date) => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={activities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh", padding: "50px", marginTop: "100px" }}
        tooltipAccessor={(event) => event.title}
        onNavigate={changeMonth} // Obsługa nawigacji kalendarza
      />
    </div>
  );
};

export default Calendar;
