import React, { useState, useEffect } from "react";
import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";

const UserDetails = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (!response.ok) {
          throw new Error("Wystąpił błąd podczas pobierania danych.");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
        console.error("Błąd:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Funkcja do generowania kolejnych dat co 7 dni
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

  // Funkcja do parsowania daty w formacie new Date(...)
  const parseDateFromString = (dateString) => {
    try {
      // Przykład: "new Date(2024, 5, 17, 12, 0)"
      const datePattern = /new Date\((\d+), (\d+), (\d+), (\d+), (\d+)\)/;
      const match = dateString.match(datePattern);

      if (!match) throw new Error("Niepoprawny format daty");

      const [_, year, month, day, hours, minutes] = match.map(Number);

      // Należy pamiętać, że miesiące w obiekcie Date w JavaScript są zerowane (0 - styczeń, 11 - grudzień)
      return new Date(year, month, day, hours, minutes);
    } catch (error) {
      console.error("Błąd parsowania daty:", error);
      return new Date(); // Zwróć bieżącą datę jako domyślną
    }
  };

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  if (!user) {
    return <p>Ładowanie danych...</p>;
  }

  const startDate = parseDateFromString(user.start);
  const weeklyDates = generateWeeklyDates(startDate, 10); // Generowanie 10 tygodniowych dat

  return (
    <div>
      <h1>{`${user.name} ${user.surname}`}</h1>
      <h2>{user.exercises}</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Obecność</th>
            <th>Uwagi</th>
          </tr>
        </thead>
        <tbody>
          {weeklyDates.map((date, index) => (
            <tr key={index}>
              <td>
                <a href="#" onClick={() => handleUserClick(user.id)}>
                  {date.toLocaleDateString()}
                </a>
              </td>
              <td>
                <button
                  style={{
                    backgroundColor: "grey",
                    border: "none",
                  }}
                >
                  <FcCheckmark style={{ width: 30, height: 30 }} />
                </button>
                <button style={{ backgroundColor: "grey", border: "none" }}>
                  <FcCancel style={{ width: 30, height: 30 }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
