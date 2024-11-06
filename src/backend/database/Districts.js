/**
 * Gets all sejm districts numbers.
 *
 * @async
 * @function
 * @param {string} powiatName - name of powiat
 * @returns {Promise<Object>} object of district
 */
const getSejmDistrict = async (powiatName) => {
  const url = `${global.SERVER_URL}/districts/sejm`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const filteredData = data.filter((district) => district.powiat_name === powiatName);
    if (filteredData.length == 0) {
      return [{ district_number: 19, id: 173, powiat_name: "Zagranica" }];
    }

    return filteredData;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }
};

/**
 * Gets all eu districts numbers.
 *
 * @async
 * @function
 * @param {string} powiatName - name of powiat
 * @returns {Promise<Object>} object of district
 */
const getEuDistrict = async (powiatName) => {
  const url = `${global.SERVER_URL}/districts/eu`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const filteredData = data.filter((district) => district.powiat_name === powiatName);
    if (filteredData.length == 0) {
      return [{ district_number: 4, id: 173, powiat_name: "Zagranica" }];
    }

    return filteredData;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }
};

module.exports = { getSejmDistrict, getEuDistrict };
