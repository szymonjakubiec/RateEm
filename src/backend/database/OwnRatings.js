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
 * Adds own rating.
 *
 * @async
 * @function
 * @param {number} user_id - ID of the user
 * @param {number} politician_id - ID of the politician
 * @param {float} value - Value of the rating
 * @returns {Promise<Object>} Added rating data
 */
const addOwnRating = async (user_id, politician_id, value) => {
  const url = `${global.SERVER_URL}/ownratings`; // Endpoint URL
  try {
    const response = await fetch(url, {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/json", // Indicate JSON format
      },
      body: JSON.stringify({ user_id, politician_id, value }), // Send data in JSON format
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    // Reading updated data
    const newRating = await response.json();
    console.log("New rating added:", newRating);
  } catch (error) {
    console.error("An error occurred while adding the rating:", error.message);
  }
};

/**
 * Updates own rating.
 *
 * @async
 * @function
 * @param {string} id - ID of the rating to update
 * @param {Object} newData - New data for the rating. Possible keys:
 * * {number} user_id - ID of the user
 * * {number} politician_id - ID of the politician
 * * {float} value - Value of the rating
 * @returns {Promise<Object>} Updated rating data
 */
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
