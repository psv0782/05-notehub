import axios from 'axios';
import type {Movie} from '../types/movie';

export interface MovieResponse {
    results: Movie[];
    total_pages: number;
}

const API_URL = 'https://api.themoviedb.org/3/search/movie';

export const fetchMovies = async (query: string, page: number): Promise<MovieResponse> => {
    const token = import.meta.env.VITE_TMDB_TOKEN;

    const response = await axios.get<MovieResponse>(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            query: query,
            page: Math.min(page, 500),
            include_adult: false,
            language: 'en-US',
        },
    });

    return response.data;
};