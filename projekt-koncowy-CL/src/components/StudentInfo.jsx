import React, { useState, useEffect } from "react";
import TableRow from "./StudentInfoNotes";
import NoteAdder from "./NoteAdder";
import { fetchUserDetails } from "../fetchUserDetails";

const UserDetails = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState(Array(10).fill(null));
  const [notes, setNotes] = useState(
    Array(10).fill({ text: "", status: null })
  );
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);

  useEffect(() => {
    fetchUserDetails(
      userId,
      (data) => {
        setUser(data);
      },
      (error) => {
        setError(error.message);
        console.error("Błąd:", error);
      }
    );
  }, [userId]);

  const generateWeeklyDates = (startDate, numberOfWeeks) => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < numberOfWeeks; i++) {
      const newDate = new Date(start);
      newDate.setDate(start.getDate() + i * 7);
      dates.push(newDate);
    }
    return dates;
  };

  const parseDateFromString = (dateString) => {
    try {
      const datePattern = /new Date\((\d+), (\d+), (\d+), (\d+), (\d+)\)/;
      const match = dateString.match(datePattern);

      if (!match) throw new Error("Niepoprawny format daty");

      const [_, year, month, day, hours, minutes] = match.map(Number);
      return new Date(year, month, day, hours, minutes);
    } catch (error) {
      console.error("Błąd parsowania daty:", error);
      return new Date();
    }
  };

  const handleStatusChange = (index, status) => {
    const newStatuses = [...statuses];
    newStatuses[index] = status;
    const newNotes = [...notes];
    newNotes[index] = { ...newNotes[index], status };
    setStatuses(newStatuses);
    setNotes(newNotes);
  };

  const handleDateClick = (index) => {
    setSelectedDateIndex(index);
  };

  const handleSaveNote = (text) => {
    const newNotes = [...notes];
    newNotes[selectedDateIndex] = { ...newNotes[selectedDateIndex], text };
    setNotes(newNotes);
    setSelectedDateIndex(null);
  };

  const handleCancelNote = () => {
    setSelectedDateIndex(null);
  };

  if (error) {
    return <p className="text-red-500">Błąd: {error}</p>;
  }

  if (!user) {
    return <p className="text-gray-700">Ładowanie danych...</p>;
  }

  const startDate = parseDateFromString(user.start);
  const weeklyDates = generateWeeklyDates(startDate, 10);

  const presentCount = statuses.filter((status) => status === "present").length;
  const percentage = (presentCount / 10) * 100;

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{`${user.name} ${user.surname}`}</h1>
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            {user.exercises}
          </h2>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300">
          Zapisz
        </button>
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Data</th>
            <th className="py-2 px-4 text-left">Obecność</th>
            <th className="py-2 px-4 text-left">Uwagi</th>
          </tr>
        </thead>
        <tbody>
          {weeklyDates.map((date, index) => (
            <TableRow
              key={index}
              date={date}
              index={index}
              onStatusChange={handleStatusChange}
              onDateClick={handleDateClick}
              note={notes[index]}
            />
          ))}
          <tr className="bg-gray-200">
            <td className="py-2 px-4 text-left" colSpan="2">
              Obecność
            </td>
            <td className="py-2 px-4 text-left">{percentage}%</td>
          </tr>
        </tbody>
      </table>
      {selectedDateIndex !== null && (
        <NoteAdder onSaveNote={handleSaveNote} onCancel={handleCancelNote} />
      )}
    </div>
  );
};

export default UserDetails;
