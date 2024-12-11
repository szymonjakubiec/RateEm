import {decrypt} from "../Encryption";



/**
 * Gets all users.
 *
 * @async
 * @returns {Promise<object[]|undefined>} Array of user objects
 */
export const getAllUsers = async () => {
  const url = `${global.SERVER_URL}/users`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    data.forEach((user) => {
      user.name = decrypt(user.name);
      user.email = decrypt(user.email);
      user.password = decrypt(user.password);
      user.phone_number = decrypt(user.phone_number);
      user.id = user.id;
    });

    return data;
  } catch (error) {
    return null;
  }
};

/**
 * Gets user ID by provided e-mail address.
 * @param {string} email - email address.
 * @returns {Promise<number>} user ID.
 */
export const getUserIdByEmail = (email) => {
  return getAllUsers()
    .then((users) => {
      return users.find((user) => user.email === email).id;
    })
    .catch((error) => {
      return null;
    });
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
export const addUser = async (name, email, password, phone_number, verified, communication_method, login_method) => {
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
    return newUser;
  } catch (error) {
    return null;
  }
};

/**
 * Updates a user.
 *
 * @async
 * @param {number} id - ID of the user to update.
 * @param {object} newData - new data object with key:value pairs to update.
 * @param {string} [newData.name] - Name of the user
 * @param {string} [newData.email] - Email of the user
 * @param {string} [newData.password] - Password of the user
 * @param {string} [newData.phone_number] - Phone number of the user
 * @param {number} [newData.verified] - Whether the user is verified
 * @param {number} [newData.communication_method] - Method of communication
 * @param {number} [newData.login_method] - Method of logging in
 * @returns {Promise<object|undefined>} Updated user data object
 */
export const updateUser = async (id, newData) => {
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
    return updatedData;
  } catch (error) {
    return null;
  }
};

/**
 * Deletes a user.
 *
 * @async
 * @param {string} id - ID of the user to delete
 * @returns {Promise<object|undefined>} Deleted user data object
 */
export const deleteUser = async (id) => {
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
    return deletedData;
  } catch (error) {
    return null;
  }
};
