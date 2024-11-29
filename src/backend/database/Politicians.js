/**
 * Gets all politicians.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of politician objects
 */
const getAllPoliticians = async () => {
  const url = `${global.SERVER_URL}/all-politicians`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching politicians:", error);
    return null;
  }
};

/**
 * Gets all politician names.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of politician name objects
 */
const getAllPoliticianNames = async () => {
  const url = `${global.SERVER_URL}/all-politicians`;
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
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching politicians:", error);
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
    console.error("Error fetching politicians:", error);
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
    console.log("Politician updated successfully:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error updating politician:", error);
    return undefined;
  }
};

/**
 * Gets requested amount of trending politician information by provided number of days
 *
 * @async
 * @function
 * @param {number} count - Amount of politicians we want to get
 * @param {number} days - Amount of days back to check
 */
const getTrendingPoliticians = async (count, days) => {
  const url = `${global.SERVER_URL}/trending-politicians?days=${days}&count=${count}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trending politicians:", error);
    return null;
  }
};


module.exports = {getAllPoliticians, getAllPoliticianNames, getPolitician, updatePolitician, getTrendingPoliticians};
