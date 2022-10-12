import { Component, onMount, createSignal, mapArray } from 'solid-js';
import toast from 'solid-toast';
import Link from '@suid/material/Link';
import Button from '@suid/material/Button';
import { notesPreview, setNotesPreview } from '../../../globalStore';
import TextEditor from '../../components/TextEditor/TextEditor';
import Typography from '@suid/material/Typography';
import shareIcon from '../../assets/share.svg';
import shieldIcon from '../../assets/shield.svg';
import xIcon from '../../assets/x.svg';
import { loggedInUser } from '../../../globalStore';
import { IsLoading } from '../../../globalTypes';

{
  /* <p>admin: 4d6 || kot: 11e || pies: 123</p> */
}

const Notes: Component = () => {
  const [isLoading, setIsLoading] = createSignal<IsLoading>('true');

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

        setIsLoading();

        if (!response.ok) {
          return toast.error("couldn't get user");
        }

        setNotesPreview(data.notesPreview);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message || 'Something went wrong');
        }

        setIsLoading();
      }
    };

    if (notesPreview().length === 0) {
      getNotes();
    }
  });

  const deleteNote = async (id: string) => {
    setIsLoading('true');

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

      setIsLoading();

      if (!response.ok) {
        return toast.error('delete error');
      }

      toast.success('note deleted');

      setNotesPreview((prev) =>
        prev.filter((note) => note._id !== deletedNoteId)
      );
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || 'Something went wrong');
      }

      setIsLoading();
    }
  };

  return (
    <div class="notesView">
      <Link href="/notes/new">
        <Button className="whiteTextButton createNoteButton">
          Create note
        </Button>
      </Link>
      {!notesPreview().length && (
        <div>
          This is an example note
          <TextEditor hasTestContent />
        </div>
      )}
      {!!notesPreview().length && (
        <div class="cardsWrapper">
          {mapArray(
            () => notesPreview(),
            (el) => (
              <div class="card">
                <Link href={`/notes/${el._id}`}>
                  <Typography className="title">{el.title}</Typography>

                  <Typography className="contentPreview">
                    {el.contentPreview}
                  </Typography>
                  <div class="footer">
                    {el.creatorId === loggedInUser()?.userId && (
                      <>
                        <img class="icon shield" src={shieldIcon} alt="share" />
                        <p>
                          You are the author of this note as the lion is the
                          king of the jungle!
                        </p>
                      </>
                    )}
                    {!!el.sharedWith?.length && (
                      <>
                        <img class="icon share" src={shareIcon} alt="share" />
                        <p>This note is shared. Good for you!</p>
                      </>
                    )}
                    <img
                      class="icon delete"
                      src={xIcon}
                      alt="share"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteNote(el._id);
                      }}
                    />
                    <p>Make this note disappear!</p>
                  </div>
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
