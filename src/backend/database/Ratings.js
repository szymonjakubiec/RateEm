/**
 * Gets all ratings.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of rating objects
 */
const getAllRatings = async () => {
  const url = `${global.SERVER_URL}/all-ratings`;

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
 * Gets ratings for a specific user id.
 *
 * @async
 * @param {number} userId - The ID of the user whose ratings are to be fetched.
 * @returns {Promise<object[]|undefined>} Array of rating objects
 */
const getRatingsUserId = async (userId) => {
  const url = `${global.SERVER_URL}/ratings-user-id?user_id=${userId}`; // Zmiana URL, aby uwzględnić userId

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
 * Gets ratings for a specific user id and politician id.
 *
 * @async
 * @param {number} user_id - ID of the user
 * @param {number} politician_id - ID of the politician
 * @returns {Promise<object[]|undefined>} Array of own rating objects
 */
const getRatingsUserIdPoliticianId = async (user_id, politician_id) => {
  const url = `${global.SERVER_URL}/ratings-user-id-politician-id?user_id=${user_id}&politician_id=${politician_id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
 * Adds rating.
 *
 * @async
 * @param {number} user_id - ID of the user
 * @param {number} politician_id - ID of the politician
 * @param {string} title - Name of the rating
 * @param {float} value - Value of the rating
 * @param {string} description - Description of the rating
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object|undefined>} New rating data object
 */
const addRating = async (
  user_id,
  politician_id,
  title,
  value,
  description,
  date
) => {
  const url = `${global.SERVER_URL}/ratings`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        politician_id,
        title,
        value,
        description,
        date,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    // Reading the added rating data
    const newRating = await response.json();
    console.log("New user data:", newRating);
    return newRating;
  } catch (error) {
    console.error("An error occurred while adding a rating:", error.message);
    return undefined;
  }
};

/**
 * Updates a rating.
 *
 * @async
 * @param {string} id - ID of the rating to update
 * @param {object} newData - New data for the rating. Possible keys:
 * * {number} user_id - ID of the user
 * * {number} politician_id - ID of the politician
 * * {string} title - Name of the rating
 * * {float} value - Value of the rating
 * * {string} description - Description of the rating
 * * {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object|undefined>} Updated rating data object
 */
const updateRating = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/ratings/${id}`;

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
    return undefined;
  }
};

/**
 * Deletes a rating.
 *
 * @async
 * @param {string} id - ID of the rating to delete
 * @returns {Promise<object|undefined>} Deleted rating data
 */
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
    return undefined;
  }
};

module.exports = {
  addRating,
  updateRating,
  deleteRating,
  getAllRatings,
  getRatingsUserId,
  getRatingsUserIdPoliticianId
};
