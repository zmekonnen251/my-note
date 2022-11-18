import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import NewNote from './NewNote';
import NoteList from './NoteList';
import useLocalStorage from './useLocalStorage';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import NoteLayout from './NoteLayout';
import Note from './Note';
import EditNote from './EditNote';

export type Note = {
	id: string;
} & NoteData;

export type RawNote = {
	id: string;
} & RawNoteData;

export type RawNoteData = {
	title: string;
	markdown: string;
	tagIds: string[];
};
export type NoteData = {
	title: string;
	markdown: string;
	tags: Tag[];
};

export type Tag = {
	id: string;
	label: string;
};
function App() {
	const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
	const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

	const noteWithTags = useMemo(() => {
		return notes.map((note) => {
			return {
				...note,
				tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
			};
		});
	}, [notes, tags]);

	const onCreateNote = ({ tags, ...data }: NoteData) => {
		setNotes((prevNotes) => {
			const newNote = {
				...data,
				id: uuidV4(),
				tagIds: tags.map((tag) => tag.id),
			};
			return [...prevNotes, newNote];
		});
	};

	const addTag = (tag: Tag) => {
		setTags((prev) => [...prev, tag]);
	};

	const onUpdateTag = (id: string, label: string) => {
		setTags((prev) => {
			return prev.map((tag) => {
				if (tag.id === id) {
					return { ...tag, label };
				}
				return tag;
			});
		});
	};

	const onDeleteTag = (id: string) => {
		setTags((prev) => {
			return prev.filter((tag) => tag.id !== id);
		});
	};

	const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
		setNotes((prevNotes) => {
			return prevNotes.map((note) => {
				if (note.id === id) {
					return {
						...note,
						...data,
						tagIds: tags.map((tag) => tag.id),
					};
				}
				return note;
			});
		});
	};

	const onDeleteNote = (id: string) => {
		setNotes((prevNotes) => {
			return prevNotes.filter((note) => note.id !== id);
		});
	};

	return (
		<Container className='my-4'>
			<Routes>
				<Route
					path='/'
					element={
						<NoteList
							availableTags={tags}
							notes={noteWithTags}
							onDeleteTag={onDeleteTag}
							onUpdateTag={onUpdateTag}
						/>
					}
				/>
				<Route
					path='/new'
					element={
						<NewNote
							onSubmit={onCreateNote}
							onAddTag={addTag}
							availableTags={tags}
						/>
					}
				/>
				<Route path='/:id' element={<NoteLayout notes={noteWithTags} />}>
					<Route index element={<Note onDelete={onDeleteNote} />} />
					<Route
						path='edit'
						element={
							<EditNote
								onSubmit={onUpdateNote}
								onAddTag={addTag}
								availableTags={tags}
							/>
						}
					/>
				</Route>
				<Route path='*' element={<Navigate to='/' />} />
			</Routes>
		</Container>
	);
}

export default App;
