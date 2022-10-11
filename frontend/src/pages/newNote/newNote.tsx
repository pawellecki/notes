import { Component, createSignal } from 'solid-js';
import { createForm } from '@felte/solid';
import toast from 'solid-toast';
import TextEditor from '../../components/TextEditor/TextEditor';
import Input from '../../components/Form/Input/Input';
import * as yup from 'yup';
import { validator } from '@felte/validator-yup';
import Button from '../../components/Button/Button';
import { IsLoading, TextEditorContentWithPreview } from '../../../globalTypes';
import { loggedInUser, setNotesPreview } from '../../../globalStore';
import { useNavigate } from 'solid-app-router';

type FormValues = {
  title: string;
};

const NewNote: Component = () => {
  const [isLoading, setIsLoading] = createSignal<IsLoading>();
  const [editorContent, setEditorContent] =
    createSignal<TextEditorContentWithPreview>({
      content: {},
      contentPreview: '',
    });

  const navigate = useNavigate();

  const schema = yup.object({
    title: yup.string().required(),
  });

  const { form, errors } = createForm({
    extend: [validator({ schema })],
    onSubmit: async (values: FormValues) => {
      setIsLoading('true');

      const isCustomContent = Object.keys(editorContent().content).length;
      const defaultDelta = '{"ops":[{"insert":"\\n"}]}';
      const content = isCustomContent
        ? JSON.stringify(editorContent().content)
        : defaultDelta;
      const contentPreview = isCustomContent
        ? editorContent().contentPreview
        : '\n';

      const contentWithPreview = {
        content,
        contentPreview,
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + loggedInUser()?.token,
          },
          body: JSON.stringify({
            title: values.title,
            ...contentWithPreview,
            tags: [],
            creatorId: loggedInUser()?.userId,
          }),
        });
        const { message, newNote } = await response.json();
        const { content, ...newNoteWithoutContent } = newNote;

        if (!response.ok) {
          setIsLoading();
          return toast.error(message);
        }

        setNotesPreview((prev) => [newNoteWithoutContent, ...prev]);
        toast.success('Saved');
        navigate('/');
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      } finally {
        setIsLoading();
      }
    },
  });

  return (
    <div class="newNoteView">
      <form use:form>
        <Button
          className="saveNewButton whiteTextButton"
          type="submit"
          isLoading={isLoading()}
          variant="text"
        >
          save & go Back
        </Button>
        <Input label="Title" name="title" error={errors().title} />
        <TextEditor
          onChange={(content, contentPreview) =>
            setEditorContent({ content, contentPreview })
          }
        />
      </form>
    </div>
  );
};

export default NewNote;
