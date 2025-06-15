import {useState} from 'react';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import NoteList from "../NoteList/NoteList.tsx";
import {useDebounce} from "use-debounce";
import {fetchNotes} from "../../services/noteService.ts";
import NoteModal from "../NoteModal/NoteModal.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import SearchBox from "../SearchBox/SearchBox.tsx";
import style from './App.module.css';

export default function App() {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearch] = useDebounce(searchText, 300);

    const notes = useQuery({
        queryKey: ["notes", debouncedSearch, currentPage],
        queryFn: () => fetchNotes(debouncedSearch, currentPage),
        placeholderData: keepPreviousData,
    });

    const totalPages = notes.data?.totalPages ?? 0;

    const handleSearchChange = (newSearch: string): void => {
        setSearchText(newSearch);
        setCurrentPage(1);
    };

    return (
        <div className={style.app}>

            <header className={style.toolbar}>
                <SearchBox value={searchText} onSearch={handleSearchChange}/>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                )}
                <button
                    className={style.button}
                    onClick={() => setIsModalOpen(true)}
                    disabled={isModalOpen}
                >
                    Create note +
                </button>
            </header>

            {notes.isLoading && <p>Loading...</p>}
            {notes.isError && <p>Error loading notes.</p>}
            {!notes.isLoading && !notes.isError && (
                <NoteList notes={notes.data?.notes ?? []}/>
            )}

            {isModalOpen && (
                <NoteModal
                    onClose={() => setIsModalOpen(false)}/>
            )}
        </div>
    );
}