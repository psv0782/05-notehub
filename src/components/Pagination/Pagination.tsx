import ReactPaginate from "react-paginate";
import style from './Pagination.module.css';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (currentPage: number) => void;
}

export default function Pagination({totalPages, currentPage, onPageChange}: PaginationProps) {
    return (
        <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({selected}) => onPageChange(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={style.pagination}
            activeClassName={style.active}
            nextLabel="→"
            previousLabel="←"
        />
    );
}