import React, { useState, useEffect } from "react";
import TableRow from "./StudentInfoNotes";
import NoteAdder from "./NoteAdder";
import { fetchUserDetails } from "../fetchUserDetails";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GiMoneyStack } from "react-icons/gi";
import UserTableWithPayments from "./Salary";

const UserDetails = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState(Array(10).fill(null));
  const [notes, setNotes] = useState(
    Array(10).fill({ text: "", status: null })
  );
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [currentView, setCurrentView] = useState("userDetails");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUserDetails(
      userId,
      (data) => {
        setUser(data);
        if (data.statuses) setStatuses(data.statuses);
        if (data.notes) setNotes(data.notes);
      },
      (error) => {
        setError(error.message);
        console.error("Błąd:", error);
      }
    );
  }, [userId]);

  const updateUserDetails = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      statuses,
      notes,
    };

    fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Wystąpił problem podczas aktualizacji danych użytkownika."
          );
        }
        return response.json();
      })
      .then(() => {
        alert("Dane użytkownika zostały pomyślnie zapisane.");
      })
      .catch((error) => {
        console.error("Błąd podczas aktualizacji danych użytkownika:", error);
      });
  };

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

  const handleNoteClick = (index) => {
    setSelectedNoteIndex(index);
  };

  const handleSaveNote = (text) => {
    const newNotes = [...notes];
    newNotes[selectedNoteIndex] = { ...newNotes[selectedNoteIndex], text };
    setNotes(newNotes);
    setSelectedNoteIndex(null);
  };

  const handleCancelNote = () => {
    setSelectedNoteIndex(null);
  };

  const handleSalaryClick = (id) => {
    if (currentView === "UserSalaryDetails") {
      setCurrentView("userDetails");
    } else {
      setSelectedUserId(id);
      setCurrentView("UserSalaryDetails");
    }
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
    <div className="flex">
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg mr-4">
        <div className="flex justify-end mb-[10px]"></div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{`${user.name} ${user.surname}`}</h1>
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              {user.exercises}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSalaryClick(user.id)}
              title="Wynagrodzenie"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300 font-bold mt-0 mb-[45px]"
            >
              <GiMoneyStack />
            </button>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300 font-bold mt-0 mb-[45px]"
              onClick={onBack}
            >
              <IoMdArrowRoundBack />
            </button>
          </div>
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
                onNoteClick={handleNoteClick}
                note={notes[index]}
              />
            ))}
            <tr className="bg-gray-200">
              <td className="py-2 px-4 text-left" colSpan="2">
                Obecność
              </td>
              <td className="py-2 px-4 text-center">{percentage}%</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center">
          <button
            className="flex bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300 mr-[15px]"
            onClick={updateUserDetails}
          >
            Zapisz
          </button>
        </div>
        {selectedNoteIndex !== null && (
          <NoteAdder onSaveNote={handleSaveNote} onCancel={handleCancelNote} />
        )}
      </div>
      {currentView === "UserSalaryDetails" && (
        <div className="flex justify-end">
          <UserTableWithPayments userId={selectedUserId} />
        </div>
      )}
    </div>
  );
};

export default UserDetails;
