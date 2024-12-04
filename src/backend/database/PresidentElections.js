/**
 * Gets all president elections.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of president election objects
 */
const getAllPresidentElections = async () => {
  const url = `${global.SERVER_URL}/president-elections`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return undefined;
  }
};

module.exports = {getAllPresidentElections};
