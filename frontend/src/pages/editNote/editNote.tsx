import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useLocation } from 'solid-app-router';
import toast from 'solid-toast';
import { createForm } from '@felte/solid';
import { TextEditorContentWithPreview } from '../../../globalTypes';
import { loggedInUser } from '../../../globalStore';
import TextEditor from '../../components/TextEditor/TextEditor';
import Button from '../../components/Button/Button';
import Input from '../../components/Form/Input/Input';
import {
  notesPreview,
  setNotesPreview,
  users,
  setUsers,
} from '../../../globalStore';
import ModalShareNote from './ModalShareNote';

const EditNote: Component = () => {
  const [title, setTitle] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [isShareOpen, setIsShareOpen] = createSignal(false);
  const [startContent, setStartContent] = createSignal('');
  const [editorContent, setEditorContent] =
    createSignal<TextEditorContentWithPreview>({
      content: {},
      contentPreview: '',
    });

  const { pathname } = useLocation();
  const noteId = pathname.split('/')[2];

  onMount(() => {
    const getNote = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/notes/${noteId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const { note } = await response.json();

        setIsLoading(false);

        if (!response.ok) {
          return toast.error(note.message);
        }

        setTitle(note.title);
        setStartContent(note.content);
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
        setIsLoading(false);
      }
    };

    const getUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { users } = await response.json();

        if (!response.ok) {
          return toast.error(users.message);
        }

        setUsers(users);
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      }
    };

    getNote();
    getUsers();
  });

  const { form } = createForm<{ title: string }>({
    onSubmit: async () => {
      setIsLoading(true);

      const bodyWithoutContent = {
        title: title(),
        contentPreview: editorContent().contentPreview,
        creatorId: loggedInUser()?.userId,
      };

      const body = {
        ...bodyWithoutContent,
        content: JSON.stringify(editorContent().content),
      };

      try {
        const response = await fetch(
          `http://localhost:5000/api/notes/${noteId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        const { note } = await response.json();
        const { _id, creatorId, contentPreview, title, tags } = note;

        setIsLoading(false);

        if (!response.ok) {
          return toast.error('kot');
        }

        const updatedNotePreview = {
          _id,
          creatorId,
          contentPreview,
          title,
          tags,
        };

        const notesWithoutUpdatedNote = notesPreview().filter(
          (note) => note._id !== noteId
        );

        setNotesPreview([updatedNotePreview, ...notesWithoutUpdatedNote]);
        toast.success('saved');
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <div>
        update note
        <form
          use:form
          style={{
            display: 'flex',
            'flex-direction': 'column',
            width: '300px',
          }}
        >
          <Input
            label="Title"
            name="title"
            value={title()}
            onChange={setTitle}
          />
          <Button type="submit" isLoading={isLoading()}>
            update note
          </Button>
        </form>
        <Button onClick={() => setIsShareOpen(true)}>share this note</Button>
        <TextEditor
          content={startContent()}
          onChange={(content, contentPreview) =>
            setEditorContent({ content, contentPreview })
          }
        />
      </div>

      <ModalShareNote
        isOpen={isShareOpen()}
        noteId={noteId}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
};

export default EditNote;
