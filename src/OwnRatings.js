const addOwnRating = async (id_uzytkownik, id_polityk, wartosc) => {
    const url = 'http://192.168.137.1:3000/api/ownratings'; // Adres URL endpointu
    try {
      const response = await fetch(url, {
        method: 'POST', // Używamy metody POST
        headers: {
          'Content-Type': 'application/json', // Informujemy, że wysyłamy JSON
        },
        body: JSON.stringify({ id_uzytkownik, id_polityk, wartosc }), // Przekazujemy dane w formacie JSON
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Błąd: ${response.status} - ${errorMessage}`);
      }
  
      // Odczytywanie zaktualizowanych danych
      const newRating = await response.json();
      console.log('Nowa ocena dodana:', newRating);
    } catch (error) {
      console.error('Wystąpił błąd podczas dodawania oceny:', error.message);
    }
  };

const getAllOwnRatings = async () => {
  const url = 'http://192.168.137.1:3000/api/ownratings';
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
const updateOwnRating = async (id, newData = {}) => {
  
  const url = `http://192.168.137.1:3000/api/ownratings/${id}`;
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
    console.log('Rating updated successfully:', updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error updating rating:', error);
    return null;
  }
};

// Function to delete a rating
const deleteOwnRating = async (id) => {
  const url = `http://192.168.137.1:3000/api/ownratings/${id}`;
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
    console.log('Rating deleted successfully:', deletedData);
    return deletedData;
  } catch (error) {
    console.error('Error deleting rating:', error);
    return null;
  }
};
  


module.exports = { addOwnRating, updateOwnRating, deleteOwnRating, getAllOwnRatings };