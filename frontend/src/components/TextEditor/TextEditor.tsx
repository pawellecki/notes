import type { Component } from 'solid-js';
import { onMount, onCleanup, createEffect } from 'solid-js';
import Quill from 'quill';
import Box from '@suid/material/Box';
import '../../../node_modules/quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import { options, testContent } from './const';
import { io } from 'socket.io-client';

// hljs.configure({d
//   // optionally configure hljs
//   languages: ['javascript', 'ruby', 'python'],
// });

//TODO dorobic save interval w quill

type Props = {
  noteId?: string;
  content?: string;
  onChange?: (content: object, contentPreview: string) => void;
  hasTestContent?: boolean;
};

const shortContentLength = 300;

const TextEditor: Component<Props> = (props) => {
  let newQuill: any;
  let socket: any;

  onMount(() => {
    newQuill = new Quill('#quill', options);

    if (props.hasTestContent) {
      newQuill.setContents(testContent);
    }

    socket = io('http://localhost:3001');

    const onTextChange = (delta, oldDelta, source) => {
      if (source !== 'user') return;

      props.onChange &&
        props.onChange(
          newQuill.getContents(),
          newQuill.getText(0, shortContentLength)
        );

      socket.emit('send-changes', delta);
    };

    const onReceiveTextChange = (delta) => {
      newQuill.updateContents(delta);
    };

    newQuill.on('text-change', onTextChange);
    socket.on('receive-changes', onReceiveTextChange);

    props.noteId && socket.emit('get-document', props.noteId);

    onCleanup(() => {
      socket.disconnect();
      newQuill.off('text-change', onTextChange);
      newQuill.off('receive-changes', onReceiveTextChange);
    });
  });

  createEffect(() => {
    const isFetchedContent = typeof props.content === 'string';
    const isQuillSet = newQuill.getContents().ops.length === 1;

    if (props.content && isFetchedContent && isQuillSet) {
      newQuill.setContents(JSON.parse(props.content), 'api');

      props.onChange &&
        props.onChange(
          newQuill.getContents(),
          newQuill.getText(0, shortContentLength)
        );
    }
  });

  return (
    <Box className="textEditorWrapper">
      <div id="toolbar"></div>
      <div id="quill"></div>
    </Box>
  );
};

export default TextEditor;
