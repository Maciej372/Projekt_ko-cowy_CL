import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login");
      const data = await response.json();

      const serverUsername = data.find((entry) => entry.username)?.username;
      const serverPassword = data.find((entry) => entry.password)?.password;

      if (username === serverUsername && password === serverPassword) {
        setMessage("Zalogowano!");
        navigate("/app");
      } else {
        setMessage("Błędny login lub hasło");
      }
    } catch (error) {
      setMessage("Błąd logowania");
      console.error("Błąd!:", error);
    }
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#242424",
      color: "#333",
    },
    formContainer: {
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    title: {
      marginBottom: "1.5rem",
      color: "#333",
    },
    inputContainer: {
      marginBottom: "1rem",
      textAlign: "left",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "4px",
      border: "1px solid #ddd",
      backgroundColor: "grey",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#242424",
      color: "#fff",
      border: "none",
      borderRadius: "15px",
      cursor: "pointer",
      fontSize: "1rem",
    },
    message: {
      marginTop: "2rem",
      color: "#242424",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Logowanie</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.inputContainer}>
            <label htmlFor="username">Login:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label htmlFor="password">Hasło:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
