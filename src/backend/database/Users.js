const addUser = async (imie, email, haslo, nr_telefonu, zweryfikowany, sposob_komunikacji, sposob_logowania) => {
    const url = 'http://10.0.2.2:3000/api/users'; // Adres URL endpointu
    try {
      const response = await fetch(url, {
        method: 'POST', // Używamy metody POST
        headers: {
          'Content-Type': 'application/json', // Informujemy, że wysyłamy JSON
        },
        body: JSON.stringify({ imie, email, haslo, nr_telefonu, zweryfikowany, sposob_komunikacji, sposob_logowania }), // Przekazujemy dane w formacie JSON
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }
  
      // Odczytywanie zaktualizowanych danych
      const newRating = await response.json();
      console.log('New user added:', newRating);
    } catch (error) {
      console.error('An error occurred during adding a user:', error.message);
    }
  };

const getAllUsers = async () => {
  const url = 'http://192.168.137.1:3000/api/users';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return null;
  }
};

// Function to update a rating
const updateUser = async (id, newData = {}) => {
  
  const url = `http://192.168.137.1:3000/api/users/${id}`;
  console.log(url);

  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedData = await response.json();
    console.log('User updated successfully:', updatedData);
    return updatedData;
  } catch (error) {
    console.error('User updating rating:', error);
    return null;
  }
};

// Function to delete a rating
const deleteUser = async (id) => {
  const url = `http://192.168.137.1:3000/api/users/${id}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const deletedData = await response.json();
    console.log('User deleted successfully:', deletedData);
    return deletedData;
  } catch (error) {
    console.error('User deleting rating:', error);
    return null;
  }
};
  


module.exports = { addUser, updateUser, deleteUser, getAllUsers };