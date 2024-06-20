import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";

const AddStudents = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [exercises, setExercises] = useState("...");
  const [lastId, setLastId] = useState(null);
  const [studentAdded, setStudentAdded] = useState(false);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Wystąpił błąd podczas pobierania danych.");
        }
        const data = await response.json();
        if (data.length > 0) {
          const maxId = Math.max(...data.map((user) => user.id));
          setLastId(maxId);
        } else {
          setLastId(0);
        }
      } catch (error) {
        console.error("Błąd:", error);
      }
    };

    fetchLastId();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSurnameChange = (e) => {
    setSurname(e.target.value);
  };

  const handleExercisesChange = (e) => {
    setExercises(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleSubmit = async () => {
    if (lastId === null) {
      console.error("Nie można dodawać użytkowników. Brak danych o ID.");
      return;
    }

    const convertToServerDateFormat = (dateString) => {
      const date = new Date(dateString);
      return `new Date(${date.getFullYear()}, ${
        date.getMonth() + 1
      }, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()})`;
    };

    const formattedStartDate = convertToServerDateFormat(startDate);

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: (lastId + 1).toString(),
          name,
          surname,
          exercises,
          start: formattedStartDate,
        }),
      });

      if (response.ok) {
        setStudentAdded(true);
        window.location.reload(); // Odśwież stronę po pomyślnym dodaniu studenta
      } else {
        console.error("Wystąpił błąd podczas dodawania studenta.");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
      {!studentAdded && (
        <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
          {/* <h2 className="text-2xl text-gray-900 mb-4">Dodaj podopiecznego</h2> */}
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Imię:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <label htmlFor="surname" className="block text-gray-700 mb-2 mt-4">
            Nazwisko:
          </label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={handleSurnameChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <label htmlFor="exercises" className="block text-gray-700 mb-2 mt-4">
            Ćwiczenia:
          </label>
          <select
            id="exercises"
            value={exercises}
            onChange={handleExercisesChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="...">...</option>
            <option value="terapia ręki">Terapia ręki</option>
            <option value="logopedia">Logopedia</option>
            <option value="zajęcia korekcyjno-kompensacyjne">
              Zajęcia korekcyjno-kompensacyjne
            </option>
            <option value="motoryka duża">Motoryka duża</option>
            <option value="motoryka mała">Motoryka mała</option>
            <option value="kompetencje językowe">Kompetencje językowe</option>
          </select>
          <label htmlFor="startDate" className="block text-gray-700 mb-2 mt-4">
            Data rozpoczęcia zajęć:
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
          >
            Dodaj
          </button>
        </div>
      )}
      {studentAdded && <UserTable />}
    </div>
  );
};

export default AddStudents;
