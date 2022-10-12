import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';
import toast from 'solid-toast';
import Modal from '@suid/material/Modal';
import Box from '@suid/material/Box';
import Switch from '@suid/material/Switch';
import Paper from '@suid/material/Paper';
import Typography from '@suid/material/Typography';
import {
  loggedInUser,
  users,
  notesPreview,
  setNotesPreview,
} from '../../../globalStore';
import { IsLoading } from '../../../globalTypes';

type Props = {
  isOpen: boolean;
  noteId: string;
  sharedWith: string[];
  setSharedWith: (ids: string[]) => void;
  onClose: () => void;
};

const ModalShareNote: Component<Props> = (props) => {
  const [isLoading, setIsLoading] = createSignal<IsLoading>();

  const { noteId, setSharedWith, onClose } = props;

  const updateGlobalNotesPreview = (sharedWith: string[]) => {
    const updatedNoteIndex = notesPreview().findIndex(
      (preview) => preview._id === noteId
    );
    const updatedNote = { ...notesPreview()[updatedNoteIndex], sharedWith };
    let updatedNotesPreview = [...notesPreview()];

    updatedNotesPreview[updatedNoteIndex] = updatedNote;
    setNotesPreview(updatedNotesPreview);
  };

  const toggleShareWithUser = async (targetUserId: string) => {
    setIsLoading('true');

    const body = {
      targetUserId,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/notes/${noteId}/share`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + loggedInUser()?.token,
          },
          body: JSON.stringify(body),
        }
      );

      const { sharedWith } = await response.json(); //?

      setIsLoading();

      if (!response.ok) {
        return toast.error('Something went wrong');
      }

      updateGlobalNotesPreview(sharedWith);
      setSharedWith(sharedWith);
      toast.success('saved');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || 'Something went wrong');
      }

      setIsLoading();
    }
  };
  // TODO zamrozic liste users kiedy sherujemy
  return (
    <Modal
      open={props.isOpen}
      onClose={onClose}
      style={{
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      }}
    >
      <Paper className="shareModalContent">
        <div>
          <Typography>Share with users</Typography>
          <For each={users()}>
            {(user) => (
              <>
                {loggedInUser()?.userId !== user.id && (
                  <Box className="shareUserRow">
                    <span>
                      <b>{user.name}</b> {user.email}
                    </span>
                    <Switch
                      checked={props.sharedWith.includes(user.id)}
                      onChange={() => toggleShareWithUser(user.id)}
                      disabled={!!isLoading()}
                    />
                  </Box>
                )}
              </>
            )}
          </For>
        </div>
      </Paper>
    </Modal>
  );
};

export default ModalShareNote;
