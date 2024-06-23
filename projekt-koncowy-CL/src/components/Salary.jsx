import React, { useState, useEffect } from "react";

const UserTableWithPayments = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [exercisePrice, setExercisePrice] = useState(null);
  const [loading, setLoading] = useState(true);

  const parseDateFromString = (dateString) => {
    const match = dateString.match(/^new Date\((.*)\)$/);
    if (!match) {
      console.error("Niepoprawny format daty");
      return new Date();
    }

    const [, dateArgs] = match;
    const dateParts = dateArgs.split(",").map(Number);

    const [year, month, day, hours, minutes] = dateParts;
    return new Date(year, month - 1, day, hours, minutes);
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

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      if (!response.ok) {
        throw new Error("Błąd podczas pobierania danych użytkownika");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Błąd:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExercisePrice = async (exerciseName) => {
    try {
      const response = await fetch("http://localhost:3000/exercises-prices");
      if (!response.ok) {
        throw new Error("Błąd podczas pobierania cen zajęć");
      }
      const prices = await response.json();
      const exercise = prices.find((e) => e.name === exerciseName);

      if (exercise) {
        setExercisePrice(parseFloat(exercise.pricePerSession));
      } else {
        setExercisePrice(0);
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (userData) {
      fetchExercisePrice(userData.exercises);
    }
  }, [userData]);

  const calculateTotalPayments = () => {
    if (!userData || !exercisePrice) return 0;

    return userData.notes.reduce((total, note) => {
      if (note.status === "present") {
        return total + exercisePrice;
      }
      return total;
    }, 0);
  };

  const renderTableRows = () => {
    if (!userData) return null;

    const startDate = parseDateFromString(userData.start);
    const weeklyDates = generateWeeklyDates(startDate, 10);

    return userData.notes.map((note, index) => (
      <tr
        key={index}
        className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
      >
        <td className="px-6 py-3">{index + 1}</td>
        <td className="px-6 py-3 font-bold">
          {weeklyDates[index].toLocaleDateString()}
        </td>
        <td className="px-6 py-3">
          {note.status === "present" ? "Obecny" : "Nieobecny"}
        </td>
        <td className="px-6 py-3">
          {note.status === "present" && exercisePrice !== null
            ? exercisePrice.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
              })
            : "0,00 zł"}
        </td>
      </tr>
    ));
  };

  const renderSummaryRow = () => {
    const totalPayments = calculateTotalPayments().toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });

    return (
      <tr className="bg-gray-200">
        <td colSpan="3" className="px-6 py-3 text-right font-bold">
          Podsumowanie
        </td>
        <td className="px-6 py-3 font-bold">{totalPayments}</td>
      </tr>
    );
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center text-lg">
      {userData && (
        <table className="w-full max-w-screen-lg bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Lp.</th>
              <th className="px-6 py-3 text-left">Data zajęcia</th>
              <th className="px-6 py-3 text-left">Obecność</th>
              <th className="px-6 py-3 text-left">Płatność</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
            {renderSummaryRow()}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTableWithPayments;
