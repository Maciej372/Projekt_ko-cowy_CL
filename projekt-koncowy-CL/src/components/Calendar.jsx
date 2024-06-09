import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Lokalizator oparty na momencie
const localizer = momentLocalizer(moment);

const Calendar = () => {
  // Dane wydarzeń do wyświetlenia w kalendarzu
  const events = [
    {
      id: 1,
      title: "Spotkanie z klientem",
      start: new Date(2024, 6, 10, 10, 0), // Rok, miesiąc (licząc od 0), dzień, godzina, minuta
      end: new Date(2024, 6, 10, 12, 0),
    },
    {
      id: 2,
      title: "Spotkanie w biurze",
      start: new Date(2024, 6, 15, 14, 0),
      end: new Date(2024, 6, 15, 16, 0),
    },
  ];

  return (
    <div>
      <h2>Kalendarz</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }} // Dostosuj wysokość kalendarza
      />
    </div>
  );
};

export default Calendar;
