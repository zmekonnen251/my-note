import React, { FormEvent, useRef, useState } from 'react';
import { Form, Col, Row, Stack, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CreatableReactSelect from 'react-select/creatable';
import { NoteData, Tag } from './App';
import { v4 as uuidV4 } from 'uuid';
import MarkdownEditor from '@uiw/react-markdown-editor';

type NoteFormProps = {
	onSubmit: (note: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	availableTags: Tag[];
} & Partial<NoteData>;

const NoteForm = ({
	onSubmit,
	onAddTag,
	availableTags,
	title = '',
	markdown = '',
	tags = [],
}: NoteFormProps) => {
	const navigate = useNavigate();
	const titleRef = useRef<HTMLInputElement>(null);
	const markdownRef = useRef<HTMLTextAreaElement>(null);
	const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
	const [markdownValue, setMarkdownValue] = useState(markdown);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const title = titleRef.current!.value;

		onSubmit({
			title,
			markdown: markdownValue,
			tags: selectedTags,
		});

		navigate('..');
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Stack gap={4}>
				<Row>
					<Col>
						<Form.Group controlId='title'>
							<Form.Label>Title</Form.Label>
							<Form.Control ref={titleRef} required defaultValue={title} />
						</Form.Group>
					</Col>
					<Col>
						<Form.Group controlId='tags'>
							<Form.Label>Tags</Form.Label>
							<CreatableReactSelect
								options={availableTags.map((tag) => {
									return {
										label: tag.label,
										value: tag.id,
									};
								})}
								onCreateOption={(label) => {
									const newTag = { id: uuidV4(), label };
									onAddTag(newTag);
									setSelectedTags((prev) => [...prev, newTag]);
								}}
								value={selectedTags.map((tag) => {
									return { label: tag.label, value: tag.id };
								})}
								onChange={(tags) => {
									setSelectedTags(
										tags.map((tag) => {
											return { id: tag.value, label: tag.label };
										})
									);
								}}
								isMulti
							/>
						</Form.Group>
					</Col>
				</Row>

				<Form.Group controlId='markdown'>
					<Form.Label>Body</Form.Label>
					<MarkdownEditor
						value={markdownValue}
						onChange={(value, viewUpdate) => setMarkdownValue(value)}
					/>
				</Form.Group>
				<Stack direction='horizontal' gap={2} className='justify-content-end'>
					<Button type='submit' variant='primary'>
						Save
					</Button>
					<Link to='..'>
						<Button type='button' variant='outline-secondary'>
							Cancel
						</Button>
					</Link>
				</Stack>
			</Stack>
		</Form>
	);
};

export default NoteForm;
