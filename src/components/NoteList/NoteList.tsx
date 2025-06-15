import type {Note} from "../../types/note.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteNote} from "../../services/noteService.ts";
import style from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({notes}: NoteListProps) {
    const queryClient = useQueryClient();

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: (id: number) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notes"]});
        },
    })

    return (
        <>
            {isPending && <p className={style.message}>Deleting note...</p>}
            {isError && (
                <p className={style.error}>Error deleting note: {(error as Error).message}
                </p>
            )}

            <ul className={style.list}>
                {notes.map((note: Note) => {
                    const {id, title, content, tag} = note;
                    return (
                        <li key={id} className={style.listItem}>
                            <h2 className={style.title}>{title}</h2>
                            <p className={style.content}>{content}</p>
                            <div className={style.footer}>
                                <span className={style.tag}>{tag}</span>
                                <button
                                    className={style.button}
                                    onClick={() => mutate(id)}
                                    disabled={isPending}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};