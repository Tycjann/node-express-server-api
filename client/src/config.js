// export const API_URL = 'http://localhost:8000/api';
export const API_URL = (process.env.NODE_ENV === 'production') ? '/api' : 'http://localhost:8000/api';