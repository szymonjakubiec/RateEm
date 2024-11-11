/**
 * Gets address for given coordinates.
 *
 * @async
 * @function
 * @param {number} latitude - latitude
 * @param {number} longitude - longitude
 * @returns {Promise<Object[]>} Array of EU election objects
 */
const getUserAddress = async (latitude, longitude) => {
  const googleApiKey = "AIzaSyBIHMXgF1F5nHAR8SE-W273o2C7dCjzvbQ";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${googleApiKey}&language=pl`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching EU elections:", error);
    return null;
  }
};

module.exports = { getUserAddress };
