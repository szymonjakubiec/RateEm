/**
 * Adds a user.
 *
 * @async
 * @function
 * @param {string} name - First name of the user
 * @param {string} email - Email of the user
 * @param {string} password - Password of the user
 * @param {string} phone_number - Phone number of the user
 * @param {boolean} verified - Whether the user is verified
 * @param {string} communication_method - Method of communication
 * @param {string} login_method - Method of logging in
 * @returns {Promise<void>}
 */
const addUser = async (name, email, password, phone_number, verified, communication_method, login_method) => {
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
  } catch (error) {
    console.error("An error occurred while adding a user:", error.message);
  }
};

/**
 * Gets all users.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of user objects
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
    return null;
  }
};

/**
 * Updates a user.
 *
 * @async
 * @function
 * @param {string} id - ID of the user to update
 * @param {Object} newData - New data for the user. Possible keys:
 * * {string} name - First name of the user
 * * {string} email - Email of the user
 * * {string} password - Password of the user
 * * {string} phone_number - Phone number of the user
 * * {boolean} verified - Whether the user is verified
 * * {string} communication_method - Method of communication
 * * {string} login_method - Method of logging in
 * @returns {Promise<Object>} Updated user data
 */
const updateUser = async (id, newData = {}) => {
  const url = `${global.SERVER_URL}/users/${id}`;
  console.log(url);

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
    return null;
  }
};

/**
 * Deletes a user.
 *
 * @async
 * @function
 * @param {string} id - ID of the user to delete
 * @returns {Promise<Object>} Deleted user data
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
    return null;
  }
};

module.exports = { addUser, updateUser, deleteUser, getAllUsers };
