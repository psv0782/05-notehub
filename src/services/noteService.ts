import axios from "axios";
import type {CreateNote, Note} from "../types/note.ts";

const API_URL = 'https://notehub-public.goit.study/api/notes';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

interface FetchParams {
    search?: string;
    page?: number;
    perPage?: number;
}

interface FetchNotes {
    notes: Note[];
    totalPages: number;
}

export async function fetchNotes(
    searchText: string,
    page: number,
    perPage: number = 12
): Promise<FetchNotes> {
    const params: FetchParams = {
        ...(searchText.trim() !== "" && {search: searchText.trim()}),
        page,
        perPage,
    };

    const result = await axiosInstance.get<FetchNotes>("/", { params });
    return result.data;
};

export async function createNote(newNote: CreateNote): Promise<Note> {
    const result = await axiosInstance.post<Note>("/" , newNote);
    return result.data;
};

export async function deleteNote (noteId: number): Promise<Note> {
    const result = await axiosInstance.delete<Note>(`/${noteId}`);
    return result.data;
};

