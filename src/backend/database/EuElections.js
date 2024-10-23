/**
 * Gets all EU elections.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of EU election objects
 */
const getAllEuElections = async () => {
  const url = `${global.SERVER_URL}/euelections`;
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

module.exports = { getAllEuElections };
