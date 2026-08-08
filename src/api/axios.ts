import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const $api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

$api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.warn("Axios request failed (suppressed locally):", error.message);
        return Promise.resolve({ data: null }); 
    }
);