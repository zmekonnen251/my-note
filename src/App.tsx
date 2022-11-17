import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import NewNote from './NewNote';
import NoteList from './NoteList';
import useLocalStorage from './useLocalStorage';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';

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

	return (
		<Container className='my-4'>
			<Routes>
				<Route
					path='/'
					element={<NoteList availableTags={tags} notes={noteWithTags} />}
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
				<Route path='/:id'>
					<Route index element={<h1>Show</h1>} />
					<Route path='edit' element={<h1>Edit</h1>} />
				</Route>
				<Route path='*' element={<Navigate to='/' />} />
			</Routes>
		</Container>
	);
}

export default App;
