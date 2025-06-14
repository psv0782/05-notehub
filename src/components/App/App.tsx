import {useEffect, useState} from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import {fetchMovies, type MovieResponse} from '../../services/movieService';
import type {Movie} from '../../types/movie';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import toast, {Toaster} from 'react-hot-toast';

export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const {
        data,
        isLoading,
        isError,
        isSuccess
    } = useQuery<MovieResponse>({
        queryKey: ['movies', searchQuery, currentPage],
        queryFn: () => fetchMovies(searchQuery, currentPage),

        enabled: !!searchQuery && searchQuery.trim().length > 0,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    const changePage = ({selected}: { selected: number }) => {
        setCurrentPage(selected + 1);
    };

    useEffect(() => {
        if (isSuccess && data?.results.length === 0) {
            toast.error("No movies found for your request.");
        }
    }, [data, isSuccess]);

    const totalPages = data?.total_pages ?? 0;

    const shouldShowPagination =
        typeof data?.total_pages === 'number' &&
        data.total_pages > 1 &&
        !isError &&
        !isLoading;

    return (
        <div className={styles.app}>
            <Toaster position="top-center"/>
            <SearchBar onSubmit={handleSearch}/>

            {isLoading && <Loader/>}
            {isError && <ErrorMessage/>}
            {isSuccess && data?.results && (
                <MovieGrid movies={data?.results || []} onSelect={handleSelectMovie}/>
            )}
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal}/>
            )}
            {shouldShowPagination && (
                <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={changePage}
                    forcePage={currentPage - 1}
                    containerClassName={styles.pagination}
                    activeClassName={styles.active}
                    nextLabel="→"
                    previousLabel="←"
                />
            )}
        </div>
    );
}