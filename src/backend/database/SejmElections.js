/**
 * Gets all Sejm elections.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of Sejm election objects
 */
const getAllSejmElections = async () => {
  const url = `${global.SERVER_URL}/sejmelections`;
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

module.exports = { getAllSejmElections };
