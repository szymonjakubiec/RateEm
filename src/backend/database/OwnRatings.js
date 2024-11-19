/**
 * Gets all own ratings.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of own rating objects
 */
const getAllOwnRatings = async () => {
  const url = `${global.SERVER_URL}/own-ratings`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return undefined;
  }
};

/**
 * Adds own rating.
 *
 * @async
 * @param {number} user_id - ID of the user
 * @param {number} politician_id - ID of the politician
 * @param {float} value - Value of the rating
 * @returns {Promise<object|undefined>} New rating data object
 */
const addOwnRating = async (user_id, politician_id, value) => {
  const url = `${global.SERVER_URL}/own-ratings`; // Endpoint URL
  try {
    const response = await fetch(url, {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/json", // Indicate JSON format
      },
      body: JSON.stringify({user_id, politician_id, value}), // Send data in JSON format
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    // Reading updated data
    const newRating = await response.json();
    console.log("New own rating added:", newRating);
    return newRating;
  } catch (error) {
    console.error("An error occurred while adding the rating:", error.message);
    return undefined;
  }
};

/**
 * Updates own rating.
 *
 * @async
 * @param {string} id - ID of the rating to update
 * @param {Object} newData - New data for the rating. Possible keys:
 * * {number} user_id - ID of the user
 * * {number} politician_id - ID of the politician
 * * {float} value - Value of the rating
 * @returns {Promise<object|undefined>} Updated rating data object
 */
const updateOwnRating = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/own-ratings/${id}`;

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
    console.log("Own rating updated successfully:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error updating rating:", error);
    return undefined;
  }
};

/**
 * Deletes own rating.
 *
 * @async
 * @param {string} id - ID of the rating to delete
 * @returns {Promise<object|undefined>} Deleted rating data object
 */
const deleteOwnRating = async (id) => {
  const url = `${global.SERVER_URL}/own-ratings/${id}`;
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
    console.log("Own rating deleted successfully:", deletedData);
    return deletedData;
  } catch (error) {
    console.error("Error deleting rating:", error);
    return undefined;
  }
};

module.exports = {
  addOwnRating,
  updateOwnRating,
  deleteOwnRating,
  getAllOwnRatings,
};
