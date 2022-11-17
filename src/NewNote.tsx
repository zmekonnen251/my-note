import React from 'react';
import { NoteData, Tag } from './App';
import NoteForm from './NoteForm';

type NewNoteProps = {
	onSubmit: (note: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	availableTags: Tag[];
};

const NewNote = ({ onSubmit, onAddTag, availableTags }: NewNoteProps) => {
	return (
		<>
			<h1>New Note</h1>
			<NoteForm
				onSubmit={onSubmit}
				onAddTag={onAddTag}
				availableTags={availableTags}
			/>
		</>
	);
};

export default NewNote;
