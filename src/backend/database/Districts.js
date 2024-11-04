/**
 * Gets all districts numbers.
 *
 * @async
 * @function
 * @param {string} powiatName - name of powiat
 * @returns {Promise<Object>} object of district
 */
const getSejmDistrict = async (powiatName) => {
  const url = `${global.SERVER_URL}/districts/sejm/${powiatName}`;
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

module.exports = { getSejmDistrict };
