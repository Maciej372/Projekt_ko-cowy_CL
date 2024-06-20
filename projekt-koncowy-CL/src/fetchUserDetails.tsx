export const fetchUserDetails = async (userId, onSucces, onFailure) => {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    if (!response.ok) {
      throw new Error("Wystąpił błąd podczas pobierania danych.");
    }
    const data = await response.json();
    onSucces(data);
    //   setUser(data);
  } catch (error) {
    onFailure(error);
    //   setError(error.message);
    //   console.error("Błąd:", error);
  }
};
