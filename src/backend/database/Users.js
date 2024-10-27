/**
 * Adds a user.
 *
 * @async
 * @function
 * @param {string} imie - First name of the user
 * @param {string} email - Email of the user
 * @param {string} haslo - Password of the user
 * @param {string} nr_telefonu - Phone number of the user
 * @param {boolean} zweryfikowany - Whether the user is verified
 * @param {string} sposob_komunikacji - Method of communication
 * @param {string} sposob_logowania - Method of logging in
 * @returns {Promise<void>}
 */
const addUser = async (
  imie,
  email,
  haslo,
  nr_telefonu,
  zweryfikowany,
  sposob_komunikacji,
  sposob_logowania
) => {
  const url = `${global.SERVER_URL}/users`; // Adres URL endpointu
  try {
    const response = await fetch(url, {
      method: "POST", // Używamy metody POST
      headers: {
        "Content-Type": "application/json", // Informujemy, że wysyłamy JSON
      },
      body: JSON.stringify({
        imie,
        email,
        haslo,
        nr_telefonu,
        zweryfikowany,
        sposob_komunikacji,
        sposob_logowania,
      }), // Przekazujemy dane w formacie JSON
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    // Odczytywanie zaktualizowanych danych
    const newRating = await response.json();
    console.log("New user added:", newRating);
  } catch (error) {
    console.error("An error occurred during adding a user:", error.message);
  }
};

/**
 * Gets all users.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of user objects
 */
const getAllUsers = async () => {
  const url = `${global.SERVER_URL}/users`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }
};

/**
 * Updates a user.
 *
 * @async
 * @function
 * @param {string} id - ID of the user to update
 * @param {Object} newData - New data for the user. Possible keys:
 * * {string} imie - First name of the user
 * * {string} email - Email of the user
 * * {string} haslo - Password of the user
 * * {string} nr_telefonu - Phone number of the user
 * * {boolean} zweryfikowany - Whether the user is verified
 * * {string} sposob_komunikacji - Method of communication
 * * {string} sposob_logowania - Method of logging in
 * @returns {Promise<Object>} Updated user data
 */
const updateUser = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/users/${id}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedData = await response.json();
    console.log("User updated successfully:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("User updating rating:", error);
    return null;
  }
};

/**
 * Deletes a user.
 *
 * @async
 * @function
 * @param {string} id - ID of the user to delete
 * @returns {Promise<Object>} Deleted user data
 */
const deleteUser = async (id) => {
  const url = `${global.SERVER_URL}/users/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const deletedData = await response.json();
    console.log("User deleted successfully:", deletedData);
    return deletedData;
  } catch (error) {
    console.error("User deleting rating:", error);
    return null;
  }
};

module.exports = { addUser, updateUser, deleteUser, getAllUsers };
