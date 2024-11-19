/**
 * Gets all Sejm elections.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of Sejm elections objects
 */
const getAllSejmElections = async () => {
  const url = `${ global.SERVER_URL }/sejm-elections`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${ response.status }`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return undefined;
  }
};

module.exports = {getAllSejmElections};
