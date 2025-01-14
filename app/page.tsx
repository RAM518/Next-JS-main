"use client";

import { useEffect, useState, JSX } from "react";
import { supabase } from "./lib/supabase";
import { NoteData } from "./types/Note";
import NoteList from "./components/note-list/NoteList";
import Sidebar from "./components/sidebar/Sidebar";

export default function Home() {
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterId, setFilterId] = useState<number>(0);

    useEffect(() => {
        const fetchNotes = async () => {
            setIsLoading(true);
            if (filterId === 0) {
                const { data } = await supabase
                    .from("notes")
                    .select("*")
                    .order("created_at", { ascending: false });
                setNotes(data || []);
            } else {
                const { data } = await supabase
                    .from("notes")
                    .select("*")
                    .eq("category", filterId)
                    .order("created_at", { ascending: false });
                setNotes(data || []);
            }
            setIsLoading(false);
        };
        fetchNotes();
    }, [filterId]);

    const handleDoubleClick = () => {
        const newNote: NoteData = {
            id: Math.random(),
            title: "Test",
            content: "Template",
            category: 1,
            created_at: new Date(),
            status: 0,
            isCreating: true,
        };

        setNotes([newNote, ...notes]);
    };

    const updateNote = async (updatedNote: NoteData) => {
        const updatedNotes = notes.map((note: NoteData) =>
            note.id === updatedNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);

        if (updatedNote.id.toString().includes(".")) {

            if (updatedNote.title === "" && updatedNote.content === "") {
                setNotes((notes: NoteData[]) =>
                    notes.filter((note: NoteData) => note.id !== updatedNote.id)
                );
                return;
            }

            const { data, error } = await supabase
                .from("notes")
                .insert({
                    title: updatedNote.title,
                    content: updatedNote.content,
                    category: updatedNote.category,
                })
                .select()
                .single();

            if (!error && data) {
                setNotes(notes =>
                    notes.map((note: NoteData) =>
                        note.id === updatedNote.id ? data : note
                    )
                );
            }
        } else {
            await supabase
                .from("notes")
                .update({
                    title: updatedNote.title,
                    content: updatedNote.content,
                    category: updatedNote.category,
                })
                .eq("id", updatedNote.id);
        }
    };

    const deleteNote = async (noteId: number) => {
        setNotes(notes.filter((note: NoteData) => note.id !== noteId));
        await supabase
            .from("notes")
            .delete()
            .eq("id", noteId);
    };
    
    return (
        <div className="flex flex-row h-screen" key="main-container">
            <div className="max-w-60 border-r shadow-md bg-white" key="sidebar">
                <Sidebar onFilterChange={setFilterId} />
            </div>
            <div
                key="content"
                className="w-full"
                onDoubleClick={handleDoubleClick}
                <div className="flex-1 p-4" key="note-list">
                <div className="flex-1 p-4">
                    {isLoading
                        ? skeletonLoader()
                        ? <p className="text-xl font-semibold text-slate-500 animate-pulse" key="no-notes">No hay notas con esta categoría...</p>
                        ? <p className="text-xl font-semibold text-slate-500 animate-pulse">No hay notas con esta categoría...</p>
                        : <NoteList notes={notes} onUpdateNote={updateNote} onDeleteNote={deleteNote} />}
                </div>
            </div>
        </div>
    );
}

const skeletonLoader = () => {
        <div className="w-full h-screen flex p-4" key="skeleton-loader">
            <div className="space-y-2.5 animate-pulse w-full" key="skeleton-items">
                <div className="flex items-center w-full space-x-4" key="skeleton-row">
                    <div className="shadow-sm rounded-md h-44 bg-gray-400 w-full" key="skeleton-item-1"></div>
                    <div className="shadow-sm rounded-md h-44 bg-gray-400 w-full"></div>
                    <div className="shadow-sm rounded-md h-44 bg-gray-300 w-full" key="skeleton-item-3"></div>
                    <div className="shadow-sm rounded-md h-44 bg-gray-200 w-full" key="skeleton-item-4"></div>
                    <div className="shadow-sm rounded-md h-44 bg-gray-200 w-full"></div>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};
