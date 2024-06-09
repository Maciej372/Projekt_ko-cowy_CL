import React, { useState, useEffect } from "react";

const UserTable = () => {
  const [users, setUsers] = useState([]);

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

  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      border: "1px solid #ddd",
      padding: "8px",
      backgroundColor: "#f2f2f2",
    },
    td: {
      border: "1px solid #ddd",
      padding: "8px",
    },
    evenRow: {
      backgroundColor: "#f2f2f2",
    },
  };

  return (
    <div>
      <h2>Lista użytkowników</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>LP</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Surname</th>
            <th style={styles.th}>Exercise</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.surname}</td>
              <td style={styles.td}>{user.exercises}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
