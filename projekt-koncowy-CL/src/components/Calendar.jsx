import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Lokalizator oparty na momencie
const localizer = momentLocalizer(moment);

const Calendar = () => {
  const activities = [
    {
      id: 1,
      title: "Adam Adamowski",
      start: new Date(2024, 5, 21, 10, 0),
      end: new Date(2024, 5, 21, 11, 0),
    },
    {
      id: 2,
      title: "Filip Filipiak",
      start: new Date(2024, 5, 15, 14, 0),
      end: new Date(2024, 5, 15, 16, 0),
    },
  ];

  return (
    <div>
      <h2 style={{ padding: "10px", marginTop: "50px" }}>Kalendarz</h2>
      <BigCalendar
        localizer={localizer}
        events={activities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, padding: "10px", marginTop: "50px" }} // Dostosuj wysokość kalendarza
        tooltipAccessor={() => "uwaga"} // Ustawienie treści tooltipu
      />
    </div>
  );
};

export default Calendar;
