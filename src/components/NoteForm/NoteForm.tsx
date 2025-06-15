import * as Yup from 'yup';
import type {CreateNote} from "../../types/note.ts";
import {useId} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createNote} from "../../services/noteService.ts";
import {Formik, Field, Form, ErrorMessage} from 'formik';
import style from './NoteForm.module.css';

const initialValues: CreateNote = {
    title: '',
    content: '',
    tag: 'Todo',
};

const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters long')
        .max(50, 'Title must be no more than 50 characters')
        .required('Title is required'),
    content: Yup.string().max(500, 'Content must be no more than 500 characters'),
    tag: Yup.string().oneOf(
        ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
        'Invalid tag')
        .required("At least one tag is required"),
});

interface NoteFormProps {
    onClose: () => void;
}

export default function NoteForm({onClose}: NoteFormProps) {
    const fieldId = useId();
    const queryClient = useQueryClient();

    const {mutate, isPending} = useMutation({
        mutationFn: (values: CreateNote) => createNote(values),
        onSuccess: () => {
            onClose();
            queryClient.invalidateQueries({queryKey: ["notes"]});
        }
    });

    const handleSubmit = (values: CreateNote) => {
        mutate(values, {
            onSuccess: () => {
                onClose();
                queryClient.invalidateQueries({queryKey: ["notes"]});
            },
            onError: (error) => {
                console.error("Failed to create note:", error);
                alert("Failed to create note. Please try again.");
            },
        });
    };


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>

            <Form className={style.form}>
                <div className={style.formGroup}>
                    <label htmlFor={`${fieldId}-title`}>Title</label>
                    <Field id={`${fieldId}-title`} type="text" name="title" className={style.input}/>
                    <ErrorMessage component="div" name="title" className={style.error}/>
                </div>

                <div className={style.formGroup}>
                    <label htmlFor={`${fieldId}-content`}>Content</label>
                    <Field as='textarea'
                           id={`${fieldId}-content`}
                           name='content'
                           rows={8}
                           className={style.textarea}
                    />
                    <ErrorMessage component="div" name="content" className={style.error}/>
                </div>

                <div className={style.formGroup}>
                    <label htmlFor={`${fieldId}-tag`}>Tag</label>
                    <Field as='select' id={`${fieldId}-tag`} name="tag" className={style.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage component="div" name="tag" className={style.error}/>
                </div>

                <div className={style.actions}>
                    <button onClick={onClose} type="button" className={style.cancelButton}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={style.submitButton}
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create note"}
                    </button>
                </div>
            </Form>
        </Formik>
    );
}