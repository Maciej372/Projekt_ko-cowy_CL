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
  const transformedEvents = users.map((user) => {
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

const parseDate = (dateString) => {
  const dateArgs = dateString
    .replace("new Date(", "")
    .replace(")", "")
    .split(", ");

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
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEvents = await fetchAndTransformUsers(currentDate);
      setActivities(fetchedEvents);
    };

    fetchData();
  }, [currentDate]);

  const changeMonth = (date) => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
      <BigCalendar
        localizer={localizer}
        events={activities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh" }}
        tooltipAccessor={(event) => event.title}
        onNavigate={changeMonth}
      />
    </div>
  );
};

export default Calendar;
