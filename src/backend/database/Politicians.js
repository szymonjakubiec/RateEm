/**
 * Gets all politicians.
 *
 * @async
 * @function
 * @param order
 * @param reverseOrder
 * @returns {Promise<Object[]>} Array of politician objects
 */
const getAllPoliticians = async (order, reverseOrder) => {
  const reverse = reverseOrder ? "DESC" : "ASC";
  const url = `${global.SERVER_URL}/all-politicians?order=${order}&reverseOrder=${reverse}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.map(({id, names_surname, name, surname, picture, global_rating, rating_count}) => ({
      key: id,
      value: names_surname,
      name,
      surname,
      picture,
      globalRating: global_rating,
      ratingCount: rating_count,
    }));

  } catch (err) {
    console.error("Error fetching politicians:", err);
    return null;
  }
};

/**
 * Gets specific politician information.
 *
 * @async
 * @function
 * @param {number} politician_id - ID of the politician
 * @returns {Promise<Object[]>} Array of own rating objects
 */
const getPolitician = async (politician_id) => {
  const url = `${global.SERVER_URL}/politicians?politician_id=${politician_id}`;
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

const updatePolitician = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/politicians/${id}`;

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
    return updatedData;
  } catch (error) {
    return null;
  }
};

/**
 * Gets requested amount of trending politician information by provided number of days
 *
 * @async
 * @function
 * @param {number} days - Amount of days back to check
 * @param order
 * @param reverseOrder
 */
const getTrendingPoliticians = async (days, order, reverseOrder) => {
  const reverse = reverseOrder ? "DESC" : "ASC";
  const url = `${global.SERVER_URL}/trending-politicians?days=${days}&order=${order}&reverseOrder=${reverse}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    const data = [];
    for await (const element of rawData) {
      data.push({
        key: element.id,
        value: element.names_surname,
        name: element.name,
        surname: element.surname,
        picture: element.picture,
        globalRating: element.global_rating,
        ratingCount: element.rating_count,
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching trending politicians:", error);
    return null;
  }
};

module.exports = {getAllPoliticians, getPolitician, updatePolitician, getTrendingPoliticians};
