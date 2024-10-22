const getAllSejmElections = async () => {
    const url = 'http://192.168.137.1:3000/api/sejmelections';
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
  
  module.exports = { getAllSejmElections };