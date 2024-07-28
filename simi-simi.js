const axios = require('axios');

const getSimiResponse = async (text) => {
    try {
        const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=id&cf=false`);
        return response.data.success;
    } catch (error) {
        console.error('Error fetching from Simi-Simi API:', error);
        return 'Maaf, gue ga ngerti.';
    }
};

module.exports = { getSimiResponse };
