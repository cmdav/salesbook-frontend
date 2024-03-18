import axios from 'axios';
import { getToken } from './Auth';
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASEURL,

});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default {
   
    post(resource, data) {
        return api.post(resource, data).then(response => response.data);
    },

   
    get(resource) {
        return api.get(resource).then(response => response.data);
    },

    
    update(resource, data) {
         
    
        return api.put(resource, data).then(response => response.data);
    },

    
    delete(resource) {
        return api.delete(resource).then(response => response.data);
    },

    
};
