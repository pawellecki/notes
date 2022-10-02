import { Component, onMount, createSignal, mapArray } from 'solid-js';
import toast from 'solid-toast';
import Link from '@suid/material/Link';
import Grid from '@suid/material/Grid';
import Button from '@suid/material/Button';
import { notesPreview, setNotesPreview } from '../../../globalStore';
import TextEditor from '../../components/TextEditor/TextEditor';
import Typography from '@suid/material/Typography';
import shareIcon from '../../assets/share.svg';
import { loggedInUser } from '../../../globalStore';

const Notes: Component = () => {
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    const getNotes = async () => {
      const { userId } = JSON.parse(localStorage.getItem('userData') ?? '');

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URI}/users/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + loggedInUser()?.token,
            },
          }
        );
        const data = await response.json();

        setIsLoading(false);

        if (!response.ok) {
          return toast.error("couldn't get user");
        }

        setNotesPreview(data.notesPreview);
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
        setIsLoading(false);
      }
    };

    if (notesPreview().length === 0) {
      getNotes();
    }
  });

  const deleteNote = async (id: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/notes/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + loggedInUser()?.token,
          },
        }
      );
      const { id: deletedNoteId } = await response.json();

      setIsLoading(false);

      if (!response.ok) {
        return toast.error('delete error');
      }

      toast.success('note deleted');

      setNotesPreview((prev) =>
        prev.filter((note) => note._id !== deletedNoteId)
      );
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div>
      all notes
      <Link href="/notes/new">Create note</Link>
      <br />
      <br />
      <br />
      {!notesPreview().length && (
        <div>
          This is an example note
          <TextEditor hasTestContent />
        </div>
      )}
      {!!notesPreview().length && (
        <Grid container spacing={4}>
          {mapArray(
            () => notesPreview(),
            (el) => (
              <Grid item xs={4}>
                <div style={{ position: 'relative', height: '400px' }}>
                  <Link
                    href={`/notes/${el._id}`}
                    style={{
                      display: 'block',
                      // width: 200,
                      height: '400px',
                      border: '2px solid grey',
                    }}
                  >
                    <Typography variant="h6">{el.title}</Typography>
                    <Typography variant="h6">
                      {!!el.sharedWith?.length && (
                        <img src={shareIcon} alt="share" />
                      )}
                    </Typography>
                    <Typography>{el.contentPreview}</Typography>
                  </Link>

                  <Button
                    onClick={() => deleteNote(el._id)}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                    }}
                    // disabled={isLoading()} //TODO
                  >
                    X
                  </Button>
                </div>
              </Grid>
            )
          )}
        </Grid>
      )}
    </div>
  );
};

export default Notes;
