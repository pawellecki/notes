import hljs from 'highlight.js';

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'],
];

export const options = {
  // debug: 'info',
  modules: {
    syntax: {
      highlight: (text) => hljs.highlightAuto(text).value,
    },
    toolbar,
  },
  // placeholder: 'Compose an epic...',
  // readOnly: true,
  theme: 'snow',
};

export const testContent = {
  ops: [
    {
      insert: 'regular text\n',
    },
    {
      attributes: {
        bold: true,
      },
      insert: 'bold',
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        italic: true,
      },
      insert: 'italic',
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        underline: true,
      },
      insert: 'underlined',
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        strike: true,
      },
      insert: 'crossed',
    },
    {
      insert: '\nquote',
    },
    {
      attributes: {
        blockquote: true,
      },
      insert: '\n',
    },
    {
      insert: 'code',
    },
    {
      attributes: {
        'code-block': true,
      },
      insert: '\n',
    },
    {
      insert: 'H1 text',
    },
    {
      attributes: {
        header: 1,
      },
      insert: '\n',
    },
    {
      insert: 'h2 text',
    },
    {
      attributes: {
        header: 2,
      },
      insert: '\n',
    },
    {
      insert: 'ol list el',
    },
    {
      attributes: {
        list: 'ordered',
      },
      insert: '\n',
    },
    {
      insert: 'ol list el2',
    },
    {
      attributes: {
        list: 'ordered',
      },
      insert: '\n',
    },
    {
      insert: 'ul list el1',
    },
    {
      attributes: {
        list: 'bullet',
      },
      insert: '\n',
    },
    {
      insert: 'ul list el 2',
    },
    {
      attributes: {
        list: 'bullet',
      },
      insert: '\n',
    },
    {
      insert: 'text',
    },
    {
      attributes: {
        script: 'sub',
      },
      insert: 'bottom',
    },
    {
      insert: '\ntext',
    },
    {
      attributes: {
        script: 'super',
      },
      insert: 'top',
    },
    {
      insert: '\ntexttextextse indent left/right',
    },
    {
      attributes: {
        indent: 1,
      },
      insert: '\n',
    },
    {
      insert: 'text\n\n',
    },
  ],
};
