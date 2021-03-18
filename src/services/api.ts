import axios from 'axios';

const api = axios.create({
    // IP do meu Celular físico e a porta do meu servidor api
    baseURL: 'http://192.168.15.7:3333',
});

export default api;
