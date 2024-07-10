import axios from 'axios';

async function startServer() {
    try{
        const response = await axios.get('http://127.0.0.1:5000/start')
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function getPrice() {
  try {
    const response = await axios.get('http://127.0.0.1:5000/');
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}