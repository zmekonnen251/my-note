import React from 'react';
import { Badge, Button, Col, Row, Stack } from 'react-bootstrap';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useNote } from './NoteLayout';

type NoteProps = {
	onDelete: (id: string) => void;
};

const Note = ({ onDelete }: NoteProps) => {
	const navigate = useNavigate();
	const note = useNote();

	return (
		<>
			<Row className='align-items-center mb-4'>
				<Col>
					<h1>{note.title}</h1>
					<Stack gap={1} direction='horizontal' className='flex-wrap'>
						{note.tags.map((tag) => (
							<Badge className='text-truncate' key={tag.id}>
								{tag.label}
							</Badge>
						))}
					</Stack>
				</Col>
				<Col xs='auto'>
					<Stack gap={2} direction='horizontal'>
						<Link to={`/${note.id}/edit`}>
							<Button variant='primary'>Edit</Button>
						</Link>
						<Button
							variant='outline-danger'
							onClick={() => {
								onDelete(note.id);
								navigate('/');
							}}
						>
							Delete
						</Button>
						<Link to='/'>
							<Button variant='outline-secondary'>Back</Button>
						</Link>
					</Stack>
				</Col>
			</Row>
			{/* <ReactMarkdown children={note.markdown} remarkPlugins={[remarkGfm]} /> */}
			<MarkdownEditor.Markdown source={note.markdown} />
		</>
	);
};

export default Note;
