import NoteForm from "../NoteForm/NoteForm.tsx";
import {useEffect} from "react";
import {createPortal} from "react-dom";
import style from "./NoteModal.module.css";

interface NoteModalProps {
    onClose: () => void;
}

export default function NoteModal({onClose}: NoteModalProps) {

    useEffect(() => {     // Закриття натисканням по Escape
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {      // Блокування скролу
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    // Закриття по кліку за межами модалки
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div
            className={style.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={style.modal}>
                <NoteForm onClose={onClose}/>
            </div>
        </div>,
        document.body
    );
}