/**
 * Gets all politicians.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of politician objects
 */
const getAllPoliticians = async () => {
  const url = `${global.SERVER_URL}/politicians`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }
};

/**
 * Gets all politician names.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} Array of politician name objects
 */
const getAllPoliticianNames = async () => {
  const url = "http://10.0.2.2:3000/api/politicians";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    const data = [];
    for await (const element of rawData) {
      data.push({
        key: element.id,
        value: element.imie__drugie_imie__nazwisko,
      });
    }
    return data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }
};

module.exports = { getAllPoliticians, getAllPoliticianNames };
// /**
//  * Adds a politician.
//  *
//  * @async
//  * @function
//  * @param {string} data_urodzenia - Birthdate of the politician
//  * @param {number} id - ID of the politician
//  * @param {string} imie - First name of the politician
//  * @param {string} imie__drugie_imie__nazwisko - Full name of the politician
//  * @param {string} link_facebook - Facebook link of the politician
//  * @param {string} link_tweeter - Twitter link of the politician
//  * @param {string} nazwisko - Last name of the politician
//  * @param {float} ocena_globalna - Overall rating of the politician
//  * @param {string} partia - Political party of the politician
//  * @param {string} partia_skrot - Shortened name of the political party
//  * @param {string} zdjecie - Image URL of the politician
//  * @returns {Promise<Object>} Added politician data
//  */
// const addPolitician = async (data_urodzenia,id,imie,imie__drugie_imie__nazwisko,link_facebook,link_tweeter,nazwisko,ocena_globalna,partia,partia_skrot,zdjecie) => {
//     const url = `${global.SERVER_URL}/politycy`; // Adres URL endpointu
//     try {
//       const response = await fetch(url, {
//         method: 'POST', // Używamy metody POST
//         headers: {
//           'Content-Type': 'application/json', // Informujemy, że wysyłamy JSON
//         },
//         body: JSON.stringify({ data_urodzenia,id,imie,imie__drugie_imie__nazwisko,link_facebook,link_tweeter,nazwisko,ocena_globalna,partia,partia_skrot,zdjecie }), // Przekazujemy dane w formacie JSON
//       });

//       if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(`Błąd: ${response.status} - ${errorMessage}`);
//       }
//       // Odczytywanie zaktualizowanych danych
//       const newRating = await response.json();
//       console.log('Nowa ocena dodana:', newRating);
//     } catch (error) {
//       console.error('Wystąpił błąd podczas dodawania oceny:', error.message);
//     }
//   };

// /**
//  * Updates a politician.
//  *
//  * @async
//  * @function
//  * @param {string} id - ID of the politician to update
//  * @param {Object} newData - New data for the politician. Possible keys:
//  * * {string} imie - First name of the politician
//  * * {string} imie__drugie_imie__nazwisko - Full name of the politician
//  * * {string} link_facebook - Facebook link of the politician
//  * * {string} link_tweeter - Twitter link of the politician
//  * * {string} nazwisko - Last name of the politician
//  * * {float} ocena_globalna - Overall rating of the politician
//  * * {string} partia - Political party of the politician
//  * * {string} partia_skrot - Shortened name of the political party
//  * * {string} zdjecie - Image URL of the politician
//  * * @returns {Promise<Object>} Updated politician data
//  */
// const updatePolitician = async (id, newData = {}) => {

//   const url = `${global.SERVER_URL}/ratings/${id}`;
//   console.log(url);

//   try {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newData),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const updatedData = await response.json();
//     console.log('Rating updated successfully:', updatedData);
//     return updatedData;
//   } catch (error) {
//     console.error('Error updating rating:', error);
//     return null;
//   }
// };

// /**
//  * Deletes a politician.
//  *
//  * @async
//  * @function
//  * @param {string} id - ID of the politician to delete
//  * @returns {Promise<Object>} Deleted politician data
//  */
// const deletePolitician = async (id) => {
//   const url = `${global.SERVER_URL}/ratings/${id}`;
//   try {
//     const response = await fetch(url, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const deletedData = await response.json();
//     console.log('Rating deleted successfully:', deletedData);
//     return deletedData;
//   } catch (error) {
//     console.error('Error deleting rating:', error);
//     return null;
//   }
// };
