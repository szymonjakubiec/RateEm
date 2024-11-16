/**
 * Gets all politicians.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of politician objects
 */
const getAllPoliticians = async () => {
  const url = `${ global.SERVER_URL }/politicians`;
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

module.exports = {getAllPoliticians};
