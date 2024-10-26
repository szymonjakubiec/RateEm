const getAllPresidentElections = async () => {
    const url = 'http://10.0.2.2:3000/api/presidentelections';
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
  
  module.exports = { getAllPresidentElections };