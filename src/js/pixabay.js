import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '36168110-3315b1c7769a47eb6f2f2f1c5';

export async function fetchImages(value = '', page = 1, perPage = 40) {
  try {
    const response = await axios.get(
      `${URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    
    return response;

  } catch (error) {
    console.log(error);
  }
}