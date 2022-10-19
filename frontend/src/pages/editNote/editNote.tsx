import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup } from 'solid-js';
import { useLocation } from 'solid-app-router';
import toast from 'solid-toast';
import * as yup from 'yup';
import { validator } from '@felte/validator-yup';
import Typography from '@suid/material/Typography';
import { createForm } from '@felte/solid';
import { TextEditorContentWithPreview, IsLoading } from '../../../globalTypes';
import TextEditor from '../../components/TextEditor/TextEditor';
import Button from '../../components/Button/Button';
import Input from '../../components/Form/Input/Input';
import {
  loggedInUser,
  notesPreview,
  setNotesPreview,
  setUsers,
} from '../../../globalStore';
import ModalShareNote from './ModalShareNote';

const SAVE_INTERVAL = 2000;

const EditNote: Component = () => {
  const [title, setTitle] = createSignal('');
  const [isLoading, setIsLoading] = createSignal<IsLoading>();
  const [isShareOpen, setIsShareOpen] = createSignal(false);
  const [noteCreatorEmail, setNoteCreatorEmail] = createSignal('');
  const [sharedWith, setSharedWith] = createSignal([]);
  const [startContent, setStartContent] = createSignal('');
  const [noteCreatorId, setNoteCreatorId] = createSignal();
  const [editorContent, setEditorContent] =
    createSignal<TextEditorContentWithPreview>({
      content: {},
      contentPreview: '',
    });

  const { pathname } = useLocation();
  const noteId = pathname.split('/')[2];

  type SubmitProps = {
    isSuccessToast?: boolean;
  };
  const submit = async ({ isSuccessToast = true }: SubmitProps) => {
    setIsLoading('true');

    const body = {
      title: title(),
      contentPreview: editorContent().contentPreview,
      creatorId: noteCreatorId(),
      content: JSON.stringify(editorContent().content),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/notes/${noteId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + loggedInUser()?.token,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      const { _id, creatorId, contentPreview, title, tags, sharedWith } =
        data.note || {};

      setIsLoading();

      if (!response.ok) {
        return toast.error('Something went wrong');
      }

      const updatedNotePreview = {
        _id,
        creatorId,
        contentPreview,
        title,
        tags,
        sharedWith,
      };

      const notesWithoutUpdatedNote = notesPreview().filter(
        (note) => note._id !== noteId
      );

      setNotesPreview([updatedNotePreview, ...notesWithoutUpdatedNote]);

      isSuccessToast && toast.success('saved');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || 'Something went wrong');
      }

      setIsLoading();
    }
  };

  onMount(() => {
    const getUsers = async (noteCreatorId: string) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/users`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { users } = await response.json();

        if (!response.ok) {
          return toast.error(users.message);
        }

        if (noteCreatorId !== loggedInUser()?.userId) {
          const noteCreator = users.find((user) => user._id === noteCreatorId);

          setNoteCreatorEmail(noteCreator.email);
        } else {
          setNoteCreatorEmail('loggedInUser');
        }

        setUsers(users);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message || 'Something went wrong');
        }
      }
    };

    const getNote = async () => {
      setIsLoading('true');

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URI}/notes/${noteId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const { note } = await response.json();

        setIsLoading();

        if (!response.ok) {
          return toast.error(note.message);
        }

        getUsers(note.creatorId);

        setTitle(note.title);
        setNoteCreatorId(note.creatorId);
        setSharedWith(note.sharedWith);
        setStartContent(note.content);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message || 'Something went wrong');
        }

        setIsLoading();
      }
    };

    getNote();

    const interval = setInterval(() => {
      submit({ isSuccessToast: false });

      console.log('submit');
    }, SAVE_INTERVAL);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  const schema = yup.object({
    title: yup.string().required(),
  });

  const { form, errors } = createForm({
    initialValues: { title: 'new note' },
    extend: validator({ schema }),
    onSubmit: submit,
  });

  return (
    <>
      <div class="editNoteView">
        <form use:form>
          <Button
            className="saveNoteButton whiteTextButton"
            variant="text"
            type="submit"
          >
            save
          </Button>
          {noteCreatorEmail() === 'loggedInUser' && (
            <Button
              className="shareNoteButton whiteTextButton"
              variant="text"
              onClick={() => setIsShareOpen(true)}
            >
              share
            </Button>
          )}
          <Input
            label="Title"
            name="title"
            value={title()}
            onChange={setTitle}
            error={errors().title}
          />
        </form>
        {noteCreatorEmail() !== 'loggedInUser' && (
          <Typography className="createdBy">
            note created by {noteCreatorEmail()}
          </Typography>
        )}
        <TextEditor
          noteId={noteId}
          content={startContent()}
          onChange={(content, contentPreview) =>
            setEditorContent({ content, contentPreview })
          }
        />
      </div>
      <ModalShareNote
        isOpen={isShareOpen()}
        noteId={noteId}
        sharedWith={sharedWith()}
        setSharedWith={setSharedWith}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
};

export default EditNote;
