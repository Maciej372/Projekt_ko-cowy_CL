import React, { useState, useEffect } from "react";
import { GiSave } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import CoursesTable from "./Prices";

const AddPrices = ({ onBack, onPriceAdded }) => {
  const [name, setName] = useState("");
  const [sessions, setSessions] = useState(1);
  const [pricePerSession, setPricePerSession] = useState("");
  const [lastId, setLastId] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    sessions: "",
    pricePerSession: "",
  });
  const [priceAdded, setPriceAdded] = useState(false);

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const response = await fetch("http://localhost:3000/exercises-prices");
        if (!response.ok) {
          throw new Error("Wystąpił błąd podczas pobierania danych.");
        }
        const data = await response.json();
        if (data.length > 0) {
          const maxId = Math.max(...data.map((item) => item.id));
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

  const handleSessionsChange = (e) => {
    setSessions(parseInt(e.target.value));
  };

  const handlePricePerSession = (e) => {
    setPricePerSession(e.target.value);
  };

  const handleSubmit = async () => {
    setErrors({
      name: "",
      sessions: "",
      pricePerSession: "",
    });

    let formIsValid = true;
    if (name.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Pole 'Rodzaj zajęć' jest wymagane.",
      }));
      formIsValid = false;
    }

    if (pricePerSession.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pricePerSession: "Pole 'Cena za spotkanie' jest wymagane.",
      }));
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/exercises-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: (lastId + 1).toString(),
          name,
          sessions: sessions,
          pricePerSession,
        }),
      });

      if (response.ok) {
        setPriceAdded(true);
      } else {
        console.error("Wystąpił błąd podczas dodawania pozycji.");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
      {!priceAdded && (
        <div>
          <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-2xl text-gray-900 mb-4">Dodaj zajęcia</h2>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300 font-bold mt-0 mb-[45px]"
                onClick={onBack}
              >
                <IoMdArrowRoundBack />
              </button>
            </div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Rodzaj zajęć
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
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
            <label htmlFor="sessions" className="block text-gray-700 mb-2 mt-4">
              Ilość spotkań
            </label>
            <input
              type="range"
              id="sessions"
              min="1"
              max="20"
              value={sessions}
              onChange={handleSessionsChange}
              required
              style={{
                width: "100%",
                cursor: "pointer",
                height: "8px",
                background: `linear-gradient(to right, orange 0%, orange ${
                  (sessions / 20) * 100
                }%, #ddd ${(sessions / 20) * 100}%, #ddd 100%)`,
                borderRadius: "5px",
                outline: "none",
                margin: "10px 0",
                appearance: "none",
              }}
            />
            <p className="text-gray-700 mt-2">
              Wybrana ilość spotkań: {sessions}
            </p>
            {errors.sessions && (
              <p className="text-red-500 text-sm">{errors.sessions}</p>
            )}
            <label
              htmlFor="pricePerSession"
              className="block text-gray-700 mb-2 mt-4"
            >
              Cena za spotkanie
            </label>
            <input
              type="number"
              id="pricePerSession"
              value={pricePerSession}
              onChange={handlePricePerSession}
              required
              className={`w-full px-4 py-2 rounded-md border ${
                errors.pricePerSession ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-blue-500`}
            />
            {errors.pricePerSession && (
              <p className="text-red-500 text-sm">{errors.pricePerSession}</p>
            )}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                title="Dodaj"
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300"
              >
                <GiSave className="w-[25px] h-[25px] p-[1px]" />
              </button>
            </div>
          </div>
        </div>
      )}
      {priceAdded && <CoursesTable />}
    </div>
  );
};

export default AddPrices;
