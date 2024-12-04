/**
 * Gets all own ratings.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of own rating objects
 */
const getAllOwnRatings = async () => {
  const url = `${global.SERVER_URL}/all-own-ratings`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

const getOwnRating = async (user_id, politician_id) => {
  const url = `${global.SERVER_URL}/own-ratings?user_id=${user_id}&politician_id=${politician_id}`;
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
    return null;
  }
};

/**
 * Gets all politician's ratings.
 *
 * @async
 * @function
 * @param {number} politician_id - ID of the politician
 * @returns {Promise<Object[]>} Array of own rating objects
 */
const getAllPoliticianOwnRatings = async (politician_id) => {
  const url = `${global.SERVER_URL}/all-politician-own-ratings?politician_id=${politician_id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
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

    const newRating = await response.json();
    return newRating;
  } catch (error) {
    return undefined;
  }
};

/**
 * Updates own rating.
 *
 * @async
 * @function
 * @param {string} user_id - ID of the user
 * @param {string} politician_id - ID of the politician
 * @param {float} value - Value of the rating
 * * {number} user_id - ID of the user
 * * {number} politician_id - ID of the politician
 * * {float} value - Value of the rating
 * @returns {Promise<object|undefined>} Updated rating data object
 */
const updateOwnRating = async (politician_id, user_id, value) => {
  const url = `${global.SERVER_URL}/own-ratings`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({politician_id, user_id, value}),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    return undefined;
  }
};

/**
 * Deletes own rating.
 *
 * @async
 * @param {number} user_id - ID of the user
 * @param {number} politician_id - ID of the politician
 * @returns {Promise<object|undefined>} Deleted rating data object
 */
const deleteOwnRating = async (user_id, politician_id) => {
  const url = `${global.SERVER_URL}/own-ratings`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({user_id, politician_id}), // Send data in JSON format
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const deletedData = await response.json();
    return deletedData;
  } catch (error) {
    return undefined;
  }
};

module.exports = {
  addOwnRating,
  updateOwnRating,
  deleteOwnRating,
  getAllOwnRatings,
  getAllPoliticianOwnRatings,
  getOwnRating,
};
