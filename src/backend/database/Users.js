/**
 * Gets all users.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of user objects
 */
const getAllUsers = async () => {
  const url = `${global.SERVER_URL}/users`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return undefined;
  }
};

/**
 * Adds a user.
 *
 * @async
 * @param {string} name - Name of the user
 * @param {string} email - Email of the user
 * @param {string} password - Password of the user
 * @param {string} phone_number - Phone number of the user
 * @param {number} verified - Whether the user is verified
 * @param {number} communication_method - Method of communication
 * @param {number} login_method - Method of logging in
 * @returns {Promise<object|undefined>} New user data object
 */
const addUser = async (
  name,
  email,
  password,
  phone_number,
  verified,
  communication_method,
  login_method
) => {
  const url = `${global.SERVER_URL}/users`; // Endpoint URL
  try {
    const response = await fetch(url, {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/json", // Indicating JSON format
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone_number,
        verified,
        communication_method,
        login_method,
      }), // Sending data in JSON format
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    // Reading the added user data
    const newUser = await response.json();
    console.log("New user added:", newUser);
    return newUser;
  } catch (error) {
    console.error("An error occurred while adding a user:", error.message);
    return undefined;
  }
};

/**
 * Updates a user.
 *
 * @async
 * @param {string} id - ID or Email of the user to update
 * @param {Object} newData - New data for the user. Possible keys:
 * * {string} name - Name of the user
 * * {string} email - Email of the user
 * * {string} password - Password of the user
 * * {string} phone_number - Phone number of the user
 * * {number} verified - Whether the user is verified
 * * {number} communication_method - Method of communication
 * * {number} login_method - Method of logging in
 * @returns {Promise<object|undefined>} Updated user data object
 */
const updateUser = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/users/${id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedData = await response.json();
    console.log("User updated successfully:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error updating user:", error);
    return undefined;
  }
};

/**
 * Deletes a user.
 *
 * @async
 * @param {string} id - ID of the user to delete
 * @returns {Promise<object|undefined>} Deleted user data object
 */
const deleteUser = async (id) => {
  const url = `${global.SERVER_URL}/users/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const deletedData = await response.json();
    console.log("User deleted successfully:", deletedData);
    return deletedData;
  } catch (error) {
    console.error("Error deleting user:", error);
    return undefined;
  }
};

module.exports = {addUser, updateUser, deleteUser, getAllUsers};
