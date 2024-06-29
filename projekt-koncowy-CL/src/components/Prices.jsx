import React, { useState, useEffect } from "react";
import { RiDeleteBack2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import AddPrices from "./AddPrices";

const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentView, setCurrentView] = useState("CoursesTable");
  const [showAddPrices, setShowAddPrices] = useState(true);

  const fetchCoursesData = async () => {
    try {
      const response = await fetch("http://localhost:3000/exercises-prices");
      if (!response.ok) {
        throw new Error("Błąd podczas pobierania danych.");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError("Błąd podczas pobierania danych.");
      console.error("Błąd:", error);
    }
  };

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const deleteCourse = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/exercises-prices/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd podczas usuwania kursu: ${response.statusText}`);
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
      setConfirmDeleteId(null);
    } catch (error) {
      setError(error.message);
      console.error("Błąd:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    deleteCourse(confirmDeleteId);
  };

  const handleAdd = () => {
    setCurrentView("AddPrices");
  };

  const handleBack = () => {
    setCurrentView("CoursesTable");
    setShowAddPrices(false);
    fetchCoursesData();
  };

  return (
    <>
      {currentView === "CoursesTable" && (
        <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
          <table className="w-full max-w-screen-lg bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Lp</th>
                <th className="px-6 py-3 text-left">Rodzaje zajęć</th>
                <th className="px-6 py-3 text-left">Ilość spotkań</th>
                <th className="px-6 py-3 text-left">Cena za spotkanie</th>
                <th className="px-6 py-3 text-left">Cena za kurs</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
                >
                  <td className="px-6 py-3 border-t border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 border-t border-gray-300">
                    {course.name}
                  </td>
                  <td className="px-6 py-3 border-t border-gray-300">
                    {course.sessions}
                  </td>
                  <td className="px-6 py-3 border-t border-gray-300">
                    {course.pricePerSession} PLN
                  </td>
                  <td className="px-6 py-3 border-t border-gray-300">
                    {course.sessions * course.pricePerSession} PLN
                  </td>
                  <td className="px-6 py-3 border-t border-gray-300">
                    {confirmDeleteId === course.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={confirmDelete}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Potwierdź
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-4 py-2 bg-gray-300 text-black rounded-md"
                        >
                          Anuluj
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(course.id)}
                        title="Usuń"
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
                      >
                        <RiDeleteBack2Line className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleAdd}
            title="Dodaj"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
          >
            <FaPlus className="w-5 h-5" />
          </button>
        </div>
      )}
      {currentView === "AddPrices" && <AddPrices onBack={handleBack} />}
    </>
  );
};

export default CoursesTable;
