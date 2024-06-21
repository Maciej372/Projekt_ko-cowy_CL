import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddStudents from "./AddStudent";
import UserDetails from "./StudentInfo";
import { RiDeleteBack2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentView, setCurrentView] = useState("userTable");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Wystąpił błąd podczas pobierania danych.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Błąd:", error);
      }
    };

    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Czy na pewno chcesz usunąć tego użytkownika?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        console.error(
          `Błąd podczas usuwania użytkownika: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  const handleAdd = () => {
    setShowAddStudent(true);
    setCurrentView("addStudent");
  };

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setCurrentView("userDetails");
  };

  const onBack = () => {
    setCurrentView("userTable");
    setSelectedUserId(null);
    setShowAddStudent(false);
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
      {currentView === "userDetails" && (
        <UserDetails userId={selectedUserId} onBack={onBack} />
      )}
      {currentView === "userTable" && (
        <>
          {/* <h2 className="text-white text-2xl mb-4">Lista użytkowników</h2> */}
          <table className="w-full max-w-screen-lg bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Lp.</th>
                <th className="px-6 py-3 text-left">Imię</th>
                <th className="px-6 py-3 text-left">Nazwisko</th>
                <th className="px-6 py-3 text-left">Zajęcia</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
                >
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">
                    <a
                      href="#"
                      className="text-black hover:underline"
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.surname}
                    </a>
                  </td>
                  <td className="px-6 py-4">{user.exercises}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user.id)}
                      title="Usuń"
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
                    >
                      <RiDeleteBack2Line className="w-[25px] h-[25px]" />
                    </button>
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
            <FaPlus className="w-[25px] h-[25px] p-[1px]" />
          </button>
        </>
      )}
      {currentView === "addStudent" && <AddStudents onBack={onBack} />}
    </div>
  );
};

export default UserTable;
