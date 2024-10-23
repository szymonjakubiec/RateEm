/**
 * Adds own rating.
 *
 * @async
 * @function
 * @param {number} id_uzytkownik - ID of the user
 * @param {number} id_polityk - ID of the politician
 * @param {float} wartosc - Value of the rating
 * @returns {Promise<Object>} Added rating data
 */
const addOwnRating = async (id_uzytkownik, id_polityk, wartosc) => {
  const url = `${global.SERVER_URL}/ownratings`; // Adres URL endpointu
  try {
    const response = await fetch(url, {
      method: "POST", // Używamy metody POST
      headers: {
        "Content-Type": "application/json", // Informujemy, że wysyłamy JSON
      },
      body: JSON.stringify({ id_uzytkownik, id_polityk, wartosc }), // Przekazujemy dane w formacie JSON
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Błąd: ${response.status} - ${errorMessage}`);
    }

    // Odczytywanie zaktualizowanych danych
    const newRating = await response.json();
    console.log("Nowa ocena dodana:", newRating);
  } catch (error) {
    console.error("Wystąpił błąd podczas dodawania oceny:", error.message);
  }
};

/**
 * Gets all own ratings.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of own rating objects
 */
const getAllOwnRatings = async () => {
  const url = `${global.SERVER_URL}/ownratings`;
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
 * Updates own rating.
 *
 * @async
 * @function
 * @param {string} id - ID of the rating to update
 * @param {Object} newData - New data for the rating. Possible keys:
 * * {number} id_uzytkownik - ID of the user
 * * {number} id_polityk - ID of the politician
 * * {float} wartosc - Value of the rating
 * @returns {Promise<Object>} Updated rating data
 */
// Function to update a rating
const updateOwnRating = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/ownratings/${id}`;
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
    console.log("Rating updated successfully:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error updating rating:", error);
    return null;
  }
};

/**
 * Deletes own rating.
 *
 * @async
 * @function
 * @param {string} id - ID of the rating to delete
 * @returns {Promise<Object>} Deleted rating data
 */
const deleteOwnRating = async (id) => {
  const url = `${global.SERVER_URL}/ownratings/${id}`;
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
    console.log("Rating deleted successfully:", deletedData);
    return deletedData;
  } catch (error) {
    console.error("Error deleting rating:", error);
    return null;
  }
};

module.exports = {
  addOwnRating,
  updateOwnRating,
  deleteOwnRating,
  getAllOwnRatings,
};
