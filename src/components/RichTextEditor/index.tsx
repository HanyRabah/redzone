"use client"
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Extension } from '@tiptap/core';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaHighlighter, FaImage, FaItalic, FaLink, FaListOl, FaListUl, FaQuoteLeft, FaQuoteRight, FaRedo, FaTable, FaUnderline, FaUndo, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import ImageUpload from '../Dashboard/_Components/ImageUpload';
import { Dialog } from '@mui/material';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customQuote: {
      setCustomQuote: () => ReturnType;
      toggleCustomQuote: () => ReturnType;
    };
  }
}

const CustomQuote = Extension.create({
  name: 'customQuote',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'paragraph+',

  defining: true,

  addAttributes() {
    return {
      class: {
        default: 'custom-quote',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="quote"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return ['div', { 'data-type': 'quote', class: 'custom-quote', ...HTMLAttributes }, 0];
  },

  addCommands() {
    return {
      setCustomQuote: 
        () => 
        ({ commands }) => commands.wrapIn(this.name),
      toggleCustomQuote: 
        () => 
        ({ commands }) => commands.toggleWrap(this.name),
    };
  },
});

const TableDialog = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (rows: number, cols: number, withHeaderRow: boolean) => void }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(rows, cols, withHeaderRow);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Insert Table</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rows</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRows(Math.max(1, rows - 1))
                  }}
                  className="p-1 rounded border hover:bg-gray-100"
                >
                  <FaMinus size={12} />
                </button>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRows(Math.max(1, parseInt(e.target.value) || 1))
                  }}
                  min="1"
                  max="20"
                  className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRows(Math.min(20, rows + 1))
                  }}
                  className="p-1 rounded border hover:bg-gray-100"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Columns</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCols(Math.max(1, cols - 1))
                  }}
                  className="p-1 rounded border hover:bg-gray-100"
                >
                  <FaMinus size={12} />
                </button>
                <input
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10"
                  className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCols(Math.min(10, cols + 1))
                  }}
                  className="p-1 rounded border hover:bg-gray-100"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={withHeaderRow}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setWithHeaderRow(e.target.checked)
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Include header row</span>
            </label>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div className="border rounded p-2 bg-gray-50">
              <table className="w-full text-xs">
                {withHeaderRow && (
                  <thead>
                    <tr>
                      {Array.from({ length: cols }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-1 py-0.5 bg-gray-200 text-center">
                          Header {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {Array.from({ length: withHeaderRow ? rows - 1 : rows }, (_, i) => (
                    <tr key={i}>
                      {Array.from({ length: cols }, (_, j) => (
                        <td key={j} className="border border-gray-300 px-1 py-0.5 text-center">
                          Cell
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};

const QuoteDialog = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (quote: { quote: string, author: string, source: string }) => void }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');

  const handleAdd = () => {
    if (quote) {
      onAdd({ quote, author, source });
      setQuote('');
      setAuthor('');
      setSource('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold mb-4">Add Quote</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Quote Text</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter your quote here..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!quote}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Add Quote
          </button>
        </div>
      </div>
    </div>
  );
};

const AdvancedRichTextEditor = ({
  value = '',
  onChange,
  minHeight = '300px',
  maxHeight = '600px',
  className = ''
}:{
  value: string,
  onChange: (value: string) => void,
  minHeight?: string,
  maxHeight?: string,
  className?: string
}) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      CustomQuote,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none px-4 py-3',
        style: `min-height: ${minHeight}; max-height: ${maxHeight}; overflow-y: auto;`,
      },
    },
  });

  const addImage = (url: string, alt = '') => {
    if (url && editor) {
      setImageDialogOpen(false)
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
  };

  const addQuote = ({ quote, author, source }: { quote: string, author: string, source: string }) => {
    if (editor) {
      let quoteHtml = `<blockquote class="custom-blockquote">
        <p class="quote-text">"${quote}"</p>`;
      
      if (author || source) {
        quoteHtml += `<cite class="quote-citation">`;
        if (author) quoteHtml += `<span class="quote-author">${author}</span>`;
        if (source) quoteHtml += `<span class="quote-source">, ${source}</span>`;
        quoteHtml += `</cite>`;
      }
      
      quoteHtml += `</blockquote>`;
      
      editor.chain().focus().insertContent(quoteHtml).run();
    }
  };

  const addTable = (rows: number, cols: number, withHeaderRow: boolean) => {
    if (editor) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
    }
  };

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setLinkDialogOpen(false);
    }
  };

  const ToolbarButton = ({ onClick, isActive, disabled, title, children }: { onClick: () => void, isActive: boolean, disabled: boolean, title: string, children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
    >
      {children}
    </button>
  );

  if (!editor) return null;

  const isInTable = editor.isActive('table');

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap gap-1">
        {/* Heading Dropdown */}
        <select
          value={editor.isActive('heading', { level: 1 }) ? 'h1' : 
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'p') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value.substring(1));
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
            }
          }}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Text Formatting */}
        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <FaBold />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <FaItalic />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <FaUnderline /> 
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Highlight"
        >
          <FaHighlighter /> 
        </ToolbarButton>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <FaListUl />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <FaListOl />
        </ToolbarButton>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <FaAlignLeft />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <FaAlignCenter /> 
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <FaAlignRight />
        </ToolbarButton>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Media & Content */}
        <ToolbarButton
          disabled={!editor}
          onClick={() => setImageDialogOpen(true)}
          title="Add Image"
          isActive={editor.isActive('image')}
        >
          <FaImage />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => setQuoteDialogOpen(true)}
          title="Add Quote"
          isActive={editor.isActive('quote')}
        >
          <FaQuoteLeft />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => setLinkDialogOpen(true)}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          <FaLink />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <FaQuoteRight />
        </ToolbarButton>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Table Controls */}
        <ToolbarButton
          disabled={!editor}
          onClick={() => setTableDialogOpen(true)}
          isActive={editor.isActive('table')}
          title="Insert Table"
        >
          <FaTable />
        </ToolbarButton>

        {/* Table editing controls - only show when cursor is in a table */}
        {isInTable && (
          <>
            <div className="w-px h-8 bg-gray-300 mx-1"></div>
            
            <ToolbarButton
              disabled={!editor}
              onClick={() => editor.chain().focus().addRowBefore().run()}
              isActive={false}
              title="Add Row Above"
            >
              <div className="flex flex-col items-center">
                <FaPlus size={8} />
                <div className="w-3 h-px bg-current mt-0.5"></div>
              </div>
            </ToolbarButton>

            <ToolbarButton
              disabled={!editor}
              onClick={() => editor.chain().focus().addRowAfter().run()}
              isActive={false}
              title="Add Row Below"
            >
              <div className="flex flex-col items-center">
                <div className="w-3 h-px bg-current mb-0.5"></div>
                <FaPlus size={8} />
              </div>
            </ToolbarButton>

            <ToolbarButton
              disabled={!editor}
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              isActive={false}
              title="Add Column Before"
            >
              <div className="flex items-center">
                <FaPlus size={8} />
                <div className="w-px h-3 bg-current ml-0.5"></div>
              </div>
            </ToolbarButton>

            <ToolbarButton
              disabled={!editor}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              isActive={false}
              title="Add Column After"
            >
              <div className="flex items-center">
                <div className="w-px h-3 bg-current mr-0.5"></div>
                <FaPlus size={8} />
              </div>
            </ToolbarButton>

            <ToolbarButton
              disabled={!editor}
              onClick={() => editor.chain().focus().deleteRow().run()}
              isActive={false}
              title="Delete Row"
            >
              <div className="flex flex-col items-center">
                <FaTrash size={8} />
                <div className="w-3 h-px bg-current mt-0.5"></div>
              </div>
            </ToolbarButton>

            <ToolbarButton
              disabled={!editor}
              onClick={() => editor.chain().focus().deleteColumn().run()}
              isActive={false}
              title="Delete Column"
            >
              <div className="flex items-center">
                <FaTrash size={8} />
                <div className="w-px h-3 bg-current ml-0.5"></div>
              </div>
            </ToolbarButton>

            <ToolbarButton
              disabled={!editor}
              onClick={() => editor.chain().focus().deleteTable().run()}
              isActive={false}
              title="Delete Table"
            >
              <FaTrash />
            </ToolbarButton>
          </>
        )}

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          isActive={editor.isActive('undo')}
          title="Undo"
        >
          <FaUndo />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          isActive={editor.isActive('redo')}
        >
          <FaRedo />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent 
          editor={editor}
          className="min-h-[300px]"
        />
      </div>

      {/* Dialogs */}
      <Dialog 
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: 'xs',
            padding: '1rem',
          },
        }}
      >
        <ImageUpload
          onChange={addImage}
          accept="image/*"
          maxSize={5}
          label="Upload Image"
          value={''}
        />
      </Dialog>

      <QuoteDialog
        isOpen={quoteDialogOpen}
        onClose={() => setQuoteDialogOpen(false)}
        onAdd={addQuote}
      />

      <TableDialog
        isOpen={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        onAdd={addTable}
      />

      {/* Link Dialog */}
      {linkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setLinkDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={addLink}
                disabled={!linkUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .editor-link {
          color: #3b82f6;
          text-decoration: underline;
        }

        .editor-link:hover {
          color: #1d4ed8;
        }

        .custom-blockquote {
          border-left: 4px solid #3b82f6;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          margin: 1.5rem 0;
          padding: 1.5rem;
          border-radius: 0 8px 8px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .custom-blockquote::before {
          content: '"';
          font-size: 4rem;
          color: #3b82f6;
          position: absolute;
          top: -10px;
          left: 20px;
          opacity: 0.3;
          font-family: serif;
        }

        .quote-text {
          font-size: 1.125rem;
          line-height: 1.6;
          font-style: italic;
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .quote-citation {
          font-style: normal;
          font-size: 0.875rem;
          color: #6b7280;
          display: block;
          text-align: right;
        }

        .quote-author {
          font-weight: 600;
        }

        .quote-source {
          font-style: italic;
        }

        .ProseMirror {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }

        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3,
        .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror h1 { font-size: 2rem; }
        .ProseMirror h2 { font-size: 1.75rem; }
        .ProseMirror h3 { font-size: 1.5rem; }

        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }

        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0.1rem 0.2rem;
          border-radius: 0.25rem;
        }

        /* Enhanced Table Styles */
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #d1d5db;
          padding: 12px 16px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
          background-color: #ffffff;
          transition: background-color 0.2s ease;
        }

        .ProseMirror table th {
          font-weight: 600;
          text-align: left;
          background-color: #f8fafc;
          border-bottom: 2px solid #cbd5e1;
          color: #374151;
        }

        .ProseMirror table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(59, 130, 246, 0.15);
          pointer-events: none;
          border: 2px solid #3b82f6;
        }

        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #3b82f6;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .ProseMirror table:hover .column-resize-handle {
          opacity: 1;
        }

        .ProseMirror table p {
          margin: 0;
        }

        .ProseMirror .tableWrapper {
          padding: 1rem 0;
          overflow-x: auto;
        }

        .ProseMirror .resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }

        /* Enhanced table hover and focus effects */
        .ProseMirror table tbody tr:hover td {
          background-color: #f8fafc;
        }

        .ProseMirror table th:hover {
          background-color: #f1f5f9;
        }

        /* Table cell focus styles */
        .ProseMirror table td:focus,
        .ProseMirror table th:focus {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
          background-color: #eff6ff;
        }

        /* Table row striping for better readability */
        .ProseMirror table tbody tr:nth-child(even) td {
          background-color: #fafafa;
        }

        .ProseMirror table tbody tr:nth-child(even):hover td {
          background-color: #f3f4f6;
        }

        /* Table selection styles */
        .ProseMirror table td.selectedCell,
        .ProseMirror table th.selectedCell {
          background-color: #dbeafe !important;
          border-color: #3b82f6;
        }

        /* Improved table borders */
        .ProseMirror table tr:first-child th:first-child {
          border-top-left-radius: 6px;
        }

        .ProseMirror table tr:first-child th:last-child {
          border-top-right-radius: 6px;
        }

        .ProseMirror table tr:last-child td:first-child {
          border-bottom-left-radius: 6px;
        }

        .ProseMirror table tr:last-child td:last-child {
          border-bottom-right-radius: 6px;
        }

        /* Table responsiveness */
        @media (max-width: 768px) {
          .ProseMirror table {
            font-size: 0.875rem;
          }
          
          .ProseMirror table td,
          .ProseMirror table th {
            padding: 8px 12px;
          }
        }

        /* Enhanced resize handle visibility */
        .ProseMirror table td:hover .column-resize-handle,
        .ProseMirror table th:hover .column-resize-handle {
          opacity: 1;
        }

        /* Table editing indicators */
        .ProseMirror table .selectedCell::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          z-index: 1;
        }

        /* Empty table cell placeholder */
        .ProseMirror table td:empty::before {
          content: ' ';
          display: inline-block;
          width: 1px;
          height: 1em;
        }
      `}</style>
    </div>
  );
};

export default AdvancedRichTextEditor;