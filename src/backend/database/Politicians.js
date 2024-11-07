/**
 * Gets all politicians.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of politician objects
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

module.exports = { getAllPoliticians, getAllPoliticianNames, getPolitician };
