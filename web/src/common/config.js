
import ip from 'ip';

const API_URL = process.env.NODE_ENV === 'development' ? `http://${ip.address()}:3000/api` : `http://${ip.address()}:8080/api`;

export default API_URL;
