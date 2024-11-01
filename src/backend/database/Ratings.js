/**
 * Gets all ratings.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of rating objects
 */
const getAllRatings = async () => {
  const url = `${global.SERVER_URL}/ratings`;
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
 * Adds rating.
 *
 * @async
 * @function
 * @param {number} user_id - ID of the user
 * @param {number} politician_id - ID of the politician
 * @param {string} title - Name of the rating
 * @param {float} value - Value of the rating
 * @param {string} description - Description of the rating
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<void>}
 */
const addRating = async (user_id, politician_id, title, value, description, date) => {
  const url = `${global.SERVER_URL}/ratings`; // Adres URL endpointu
  try {
    const response = await fetch(url, {
      method: "POST", // Używamy metody POST
      headers: {
        "Content-Type": "application/json", // Informujemy, że wysyłamy JSON
      },
      body: JSON.stringify({
        user_id,
        politician_id,
        title,
        value,
        description,
        date,
      }), // Przekazujemy dane w formacie JSON
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
 * Updates a rating.
 *
 * @async
 * @function
 * @param {string} id - ID of the rating to update
 * @param {object} newData - New data for the rating. Possible keys:
 * * {number} user_id - ID of the user
 * * {number} politician_id - ID of the politician
 * * {string} title - Name of the rating
 * * {float} value - Value of the rating
 * * {string} description - Description of the rating
 * * {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Updated rating data
 */
// Function to update a rating
const updateRating = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/ratings/${id}`;
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
 * Deletes a rating.
 *
 * @async
 * @function
 * @param {string} id - ID of the rating to delete
 * @returns {Promise<Object>} Deleted rating data
 */
// Function to delete a rating
const deleteRating = async (id) => {
  const url = `${global.SERVER_URL}/ratings/${id}`;
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

module.exports = { addRating, updateRating, deleteRating, getAllRatings };
