import hljs from 'highlight.js';

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],

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
      highlight: (text: string) => hljs.highlightAuto(text).value,
    },
    toolbar,
  },
  placeholder: 'Winter is coming..',
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
      insert: '\nQuote: Talk is cheap. Show me the code',
    },
    {
      attributes: {
        blockquote: true,
      },
      insert: '\n',
    },
    {
      insert: 'if (isCodeOk) {',
    },
    {
      attributes: {
        'code-block': true,
      },
      insert: '\n',
    },
    {
      insert: '    createNote()',
    },
    {
      attributes: {
        'code-block': true,
      },
      insert: '\n',
    },
    {
      insert: '}',
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
      insert: 'ol list el1',
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
      insert: 'ul list el2',
    },
    {
      attributes: {
        list: 'bullet',
      },
      insert: '\n',
    },
    {
      insert: '\ntext indent left/right',
    },
    {
      attributes: {
        indent: 1,
      },
      insert: '\n',
    },
    { insert: 'float left\nfloat right' },
    { attributes: { align: 'right', direction: 'rtl' }, insert: '\n' },

    {
      attributes: {
        size: 'small',
      },
      insert: 'Small',
    },
    {
      insert: ' Normal ',
    },
    {
      attributes: {
        size: 'large',
      },
      insert: 'Large',
    },
    {
      insert: ' ',
    },
    {
      attributes: {
        size: 'huge',
      },
      insert: 'Huge',
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        size: 'huge',
      },
      insert: 'Heading 1',
    },
    {
      insert: '\nHeading 2',
    },
    {
      attributes: {
        header: 2,
      },
      insert: '\n',
    },
    {
      insert: 'Heading 3',
    },
    {
      attributes: {
        header: 3,
      },
      insert: '\n',
    },
    {
      insert: 'Heading 4',
    },
    {
      attributes: {
        header: 4,
      },
      insert: '\n',
    },
    {
      insert: 'Heading 5',
    },
    {
      attributes: {
        header: 5,
      },
      insert: '\n',
    },
    {
      insert: 'Heading 6',
    },
    {
      attributes: {
        header: 6,
      },
      insert: '\n',
    },
    {
      insert: 'Normal\n',
    },
    {
      attributes: {
        color: '#0066cc',
      },
      insert: 'color text',
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        background: '#cce0f5',
      },
      insert: 'color background',
    },
    {
      insert: '\nSans Serif\n',
    },
    {
      attributes: {
        font: 'serif',
      },
      insert: 'Serif',
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        font: 'monospace',
      },
      insert: 'Monospace',
    },
    {
      insert: '\n',
    },
    {
      insert: 'left\ncenter',
    },
    {
      attributes: {
        align: 'center',
      },
      insert: '\n',
    },
    {
      insert: 'right',
    },
    {
      attributes: {
        align: 'right',
      },
      insert: '\n',
    },
  ],
};
