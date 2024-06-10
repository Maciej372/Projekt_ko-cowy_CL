import React, { useState, useEffect } from "react";
import AddStudents from "./AddStudent";
import UserDetails from "./StudentInfo";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // Stan przechowujący ID wybranego użytkownika

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

  const handleDelete = async (id) => {
    // Potwierdzenie usunięcia
    const confirmDelete = window.confirm(
      "Czy na pewno chcesz usunąć tego użytkownika?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Usuń użytkownika z lokalnego stanu
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        console.log(`Użytkownik o ID ${id} został usunięty.`);
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
  };

  const handleUserClick = (id) => {
    setSelectedUserId(id); // Ustawia wybrane ID użytkownika
  };

  const styles = {
    table: {
      height: 500,
      padding: "10px",
      marginTop: "50px",
      width: "100%",
      borderCollapse: "collapse",
      color: "black",
      fontWeight: "bold",
    },
    th: {
      border: "2px solid #ddd",
      padding: "8px",
      backgroundColor: "#083e66",
      color: "white",
    },
    td: {
      border: "1px solid #ddd",
      padding: "8px",
      backgroundColor: "#e5e5e5",
    },
    button: {
      margin: "0 5px",
      padding: "5px 10px",
      cursor: "pointer",
      backgroundColor: "#083e66",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
    },
  };

  return (
    <div>
      {selectedUserId ? ( // Jeśli wybrano użytkownika, wyświetl komponent UserDetails
        <UserDetails userId={selectedUserId} />
      ) : (
        !showAddStudent && (
          <>
            <h2>Lista użytkowników</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Lp.</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Surname</th>
                  <th style={styles.th}>Exercise</th>
                  <th style={styles.th}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>
                      {/* Dodaj onClick do linku */}
                      <a href="#" onClick={() => handleUserClick(user.id)}>
                        {user.surname}
                      </a>
                    </td>
                    <td style={styles.td}>{user.exercises}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.button}
                        onClick={() => handleDelete(user.id)}
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={styles.button} onClick={handleAdd}>
              Dodaj
            </button>
          </>
        )
      )}
      {showAddStudent && <AddStudents />}
    </div>
  );
};

export default UserTable;
