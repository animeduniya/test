import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Home data fetcher
export const fetchHomeData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
};

// Top 10 anime fetcher
export const fetchTopTen = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/top-ten`);
    return response.data.results.topTen;
  } catch (error) {
    console.error('Error fetching top ten:', error);
    throw error;
  }
};

// Top search fetcher
export const fetchTopSearch = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/top-search`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top search:', error);
    throw error;
  }
};

// Anime info fetcher
export const fetchAnimeInfo = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/info?id=${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching anime info:', error);
    throw error;
  }
};

// Random anime fetcher
export const fetchRandomAnime = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/random`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching random anime:', error);
    throw error;
  }
};

// Category fetcher
export const fetchCategory = async (category, page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${category}${page ? `?page=${page}` : ''}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Producer/Studio fetcher
export const fetchProducer = async (producer, page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/producer/${producer}${page ? `?page=${page}` : ''}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching producer:', error);
    throw error;
  }
};

// Search fetcher
export const fetchSearch = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search?keyword=${keyword}`);
    return response.data.results;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

// Search suggestions fetcher
export const fetchSearchSuggestions = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/suggest?keyword=${keyword}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    throw error;
  }
};

// Filter fetcher
export const fetchFilteredAnime = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/filter`, { params });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching filtered anime:', error);
    throw error;
  }
};

// Schedule fetcher
export const fetchSchedule = async (date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedule?date=${date}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

// Next episode schedule fetcher
export const fetchNextEpisodeSchedule = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedule/${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching next episode schedule:', error);
    throw error;
  }
};

// Qtip fetcher
export const fetchQtip = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qtip/${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching qtip:', error);
    throw error;
  }
};

// Characters fetcher
export const fetchCharacters = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/character/list/${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

// Character details fetcher
export const fetchCharacterDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/character/${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching character details:', error);
    throw error;
  }
};

// Voice actor details fetcher
export const fetchVoiceActorDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/actors/${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching voice actor details:', error);
    throw error;
  }
}; 