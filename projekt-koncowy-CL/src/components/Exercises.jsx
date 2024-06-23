import React, { useState, useEffect } from "react";

const ExerciseSelect = ({ onExerciseChange }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    exercises: "",
    startDate: "",
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://localhost:3000/exercises-prices");
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania danych.");
        }
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error("Błąd:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          exercises: "Błąd podczas ładowania zajęć.",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleExercisesChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedExercise(selectedValue);
    if (onExerciseChange) {
      onExerciseChange(selectedValue);
    }
  };

  return (
    <div>
      <label htmlFor="exercise-select" className="block text-gray-700 mb-2">
        Wybierz zajęcia:
      </label>
      <select
        id="exercise-select"
        value={selectedExercise}
        onChange={handleExercisesChange}
        required
        className={`w-full px-4 py-2 rounded-md border ${
          errors.exercises ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:border-blue-500`}
      >
        <option value="" disabled>
          ...
        </option>
        {loading ? (
          <option value="" disabled>
            Ładowanie...
          </option>
        ) : (
          exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.name}>
              {exercise.name}
            </option>
          ))
        )}
      </select>
      {errors.exercises && (
        <p className="text-red-500 text-sm">{errors.exercises}</p>
      )}
    </div>
  );
};

export default ExerciseSelect;
