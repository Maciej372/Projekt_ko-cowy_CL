import React, { useState, useEffect } from "react";
import UserTable from "./UsersLists";

const AddStudents = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [exercises, setExercises] = useState("");
  const [lastId, setLastId] = useState(null);
  const [studentAdded, setStudentAdded] = useState(false);

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Wystąpił błąd podczas pobierania danych.");
        }
        const data = await response.json();
        if (data.length > 0) {
          // Znajdź największe ID
          const maxId = Math.max(...data.map((user) => user.id));
          setLastId(maxId);
        } else {
          // Jeśli nie ma użytkowników, ustaw ID na 0
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

  const handleSubmit = async () => {
    // Sprawdź, czy lastId zostało ustawione
    if (lastId === null) {
      console.error("Nie można dodawać użytkowników. Brak danych o ID.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lastId + 1,
          name,
          surname,
          exercises, // Dodanie wybranych ćwiczeń do danych wysyłanych do serwera
        }),
      });

      if (response.ok) {
        setStudentAdded(true); // Ustawienie studentAdded na true po pomyślnym dodaniu
      } else {
        console.error("Wystąpił błąd podczas dodawania studenta.");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <div>
      {!studentAdded && (
        <div>
          <h2>Dodaj studenta</h2>
          <label htmlFor="name">Imię:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
          <label htmlFor="surname">Nazwisko:</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={handleSurnameChange}
          />
          <label htmlFor="exercises">Ćwiczenia:</label>
          <select
            id="exercises"
            value={exercises}
            onChange={handleExercisesChange}
          >
            <option value="terapia ręki">Terapia ręki</option>
            <option value="logopedia">Logopedia</option>
            <option value="zajęcia korekcyjno-kompensacyjne">
              Zajęcia korekcyjno-kompensacyjne
            </option>
            <option value="motoryka duża">Motoryka duża</option>
            <option value="motoryka mała">Motoryka mała</option>
            <option value="kompetencje językowe">Kompetencje językowe</option>
          </select>
          <button onClick={handleSubmit}>Dodaj</button>
        </div>
      )}
      {studentAdded && <UserTable />}
    </div>
  );
};

export default AddStudents;
