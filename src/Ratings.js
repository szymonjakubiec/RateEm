const addRating = async (id_uzytkownik, id_polityk, nazwa, wartosc, opis, data) => {
    const url = 'http://192.168.137.1:3000/api/ratings'; // Adres URL endpointu
    try {
      const response = await fetch(url, {
        method: 'POST', // Używamy metody POST
        headers: {
          'Content-Type': 'application/json', // Informujemy, że wysyłamy JSON
        },
        body: JSON.stringify({ id_uzytkownik, id_polityk, nazwa, wartosc, opis, data }), // Przekazujemy dane w formacie JSON
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

const getAllRatings = async () => {
  const url = 'http://192.168.137.1:3000/api/ratings';
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
const updateRating = async (id, newData = {}) => {
  
  const url = `http://192.168.137.1:3000/api/ratings/${id}`;
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
const deleteRating = async (id) => {
  const url = `http://192.168.137.1:3000/api/ratings/${id}`;
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
  


module.exports = { addRating, updateRating, deleteRating, getAllRatings };