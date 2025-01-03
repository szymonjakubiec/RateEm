/**
 * Gets all EU elections.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of EU election objects
 */
const getAllEuElections = async () => {
  const url = `${global.SERVER_URL}/eu-elections`;
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

module.exports = {getAllEuElections};
