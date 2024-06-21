import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import { GiSave } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import ExerciseSelect from "./Exercises";

const AddStudents = ({ onBack }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [lastId, setLastId] = useState(null);
  const [studentAdded, setStudentAdded] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    exercises: "",
    startDate: "",
  });

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

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleExerciseChange = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleSubmit = async () => {
    // Resetowanie stanu błędów
    setErrors({
      name: "",
      surname: "",
      exercises: "",
      startDate: "",
    });

    // Walidacja pól
    let formIsValid = true;
    if (name.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Pole 'Imię' jest wymagane.",
      }));
      formIsValid = false;
    }
    if (surname.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        surname: "Pole 'Nazwisko' jest wymagane.",
      }));
      formIsValid = false;
    }
    if (selectedExercise.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        exercises: "Wybierz rodzaj ćwiczeń.",
      }));
      formIsValid = false;
    }
    if (startDate.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        startDate: "Pole 'Data rozpoczęcia zajęć' jest wymagane.",
      }));
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

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
          exercises: selectedExercise,
          start: formattedStartDate,
        }),
      });

      if (response.ok) {
        setStudentAdded(true);
        setName(""); // Reset name
        setSurname(""); // Reset surname
        setSelectedExercise(""); // Reset selectedExercise
        setStartDate(""); // Reset startDate
        setStudentAdded(false); // Reset form state
        window.location.reload();
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
          <div className="flex justify-between">
            <h2 className="text-2xl text-gray-900 mb-4">
              Dodaj <br />
              podopiecznego
            </h2>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300 font-bold mt-0 mb-[45px]"
              onClick={onBack}
            >
              <IoMdArrowRoundBack />
            </button>
          </div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Imię:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
            className={`w-full px-4 py-2 rounded-md border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <label htmlFor="surname" className="block text-gray-700 mb-2 mt-4">
            Nazwisko:
          </label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={handleSurnameChange}
            required
            className={`w-full px-4 py-2 rounded-md border ${
              errors.surname ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500`}
          />
          {errors.surname && (
            <p className="text-red-500 text-sm">{errors.surname}</p>
          )}
          <label
            htmlFor="selectedExercise"
            className="block text-gray-700 mb-2 mt-4"
          >
            Rodzaj ćwiczeń:
          </label>
          <ExerciseSelect onExerciseChange={handleExerciseChange} />
          {errors.exercises && (
            <p className="text-red-500 text-sm">{errors.exercises}</p>
          )}
          <label htmlFor="startDate" className="block text-gray-700 mb-2 mt-4">
            Data rozpoczęcia zajęć:
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            required
            className={`w-full px-4 py-2 rounded-md border ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate}</p>
          )}
          <button
            onClick={handleSubmit}
            title="Dodaj"
            className=" flex justify-center w-full mt-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
          >
            <GiSave className="w-[25px] h-[25px] p-[1px]" />
          </button>
        </div>
      )}
      {studentAdded && <UserTable />}
    </div>
  );
};

export default AddStudents;
