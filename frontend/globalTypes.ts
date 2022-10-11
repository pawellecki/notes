export type Note = {
  _id: string;
  creatorId: string;
  content: object;
  contentPreview: string;
  title: string;
  tags: string[];
  sharedWith: string[];
};

export type NotePreview = Omit<Note, 'content'>;

export type LoggedInUser = {
  token: string;
  userId: string;
  email: string;
};

export type User = {
  name: string;
  email: string;
  id: string;
};

export type TextEditorContentWithPreview = {
  content: object;
  contentPreview: string;
};

export type IsLoading = 'true' | undefined;
