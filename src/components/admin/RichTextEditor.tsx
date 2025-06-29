'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  ButtonGroup,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  Link as LinkIcon,
  FormatQuote as QuoteIcon,
  Code as CodeIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatAlignJustify as AlignJustifyIcon,
  Highlight as HighlightIcon,
  FormatClear as ClearFormatIcon
} from '@mui/icons-material'
import { useState } from 'react'

interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  minHeight?: string
  maxHeight?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  minHeight = "200px",
  maxHeight = "600px",
  disabled = false,
  error = false,
  helperText
}: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline hover:text-blue-700',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none p-4`,
        style: `min-height: ${minHeight}; max-height: ${maxHeight}; overflow-y: auto;`,
      },
    },
  })

  if (!editor) {
    return null
  }

  const handleAddLink = () => {
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)

    setLinkText(selectedText)
    setLinkUrl('')
    setLinkDialogOpen(true)
  }

  const confirmAddLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}">${linkText}</a>`)
          .run()
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: linkUrl })
          .run()
      }
    }
    setLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  const setHeading = (level: number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
    }
  }

  const getActiveHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) {
        return `H${i}`
      }
    }
    return 'P'
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    tooltip,
    children
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    tooltip: string
    children: React.ReactNode
  }) => (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        size="small"
        sx={{
          color: isActive ? 'primary.main' : 'text.secondary',
          bgcolor: isActive ? alpha('#1976d2', 0.1) : 'transparent',
          '&:hover': {
            bgcolor: isActive ? alpha('#1976d2', 0.2) : 'action.hover',
          },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  )

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: error ? 'error.main' : disabled ? 'action.disabled' : 'divider',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {/* Toolbar */}
        <Toolbar
          variant="dense"
          sx={{
            minHeight: 56,
            bgcolor: alpha('#f5f5f5', 0.5),
            borderBottom: '1px solid',
            borderColor: 'divider',
            gap: 0.5,
            flexWrap: 'wrap',
            py: 1
          }}
        >
          {/* Text Format Group */}
          <ButtonGroup variant="text" size="small">
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={getActiveHeading()}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === 'P') {
                    setHeading(0)
                  } else {
                    setHeading(parseInt(value.substring(1)))
                  }
                }}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    py: 0.5,
                    fontSize: '0.875rem'
                  }
                }}
              >
                <MenuItem value="P">Paragraph</MenuItem>
                <MenuItem value="H1">Heading 1</MenuItem>
                <MenuItem value="H2">Heading 2</MenuItem>
                <MenuItem value="H3">Heading 3</MenuItem>
                <MenuItem value="H4">Heading 4</MenuItem>
                <MenuItem value="H5">Heading 5</MenuItem>
                <MenuItem value="H6">Heading 6</MenuItem>
              </Select>
            </FormControl>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Style Group */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              tooltip="Bold (Ctrl+B)"
            >
              <BoldIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              tooltip="Italic (Ctrl+I)"
            >
              <ItalicIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              tooltip="Underline (Ctrl+U)"
            >
              <UnderlineIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive('highlight')}
              tooltip="Highlight"
            >
              <HighlightIcon fontSize="small" />
            </ToolbarButton>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* List Group */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              tooltip="Bullet List"
            >
              <BulletListIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              tooltip="Numbered List"
            >
              <NumberedListIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              tooltip="Quote"
            >
              <QuoteIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              tooltip="Inline Code"
            >
              <CodeIcon fontSize="small" />
            </ToolbarButton>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Alignment Group */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              tooltip="Align Left"
            >
              <AlignLeftIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              tooltip="Align Center"
            >
              <AlignCenterIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              tooltip="Align Right"
            >
              <AlignRightIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              tooltip="Justify"
            >
              <AlignJustifyIcon fontSize="small" />
            </ToolbarButton>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Action Group */}
          <ButtonGroup>
            <ToolbarButton
              onClick={handleAddLink}
              isActive={editor.isActive('link')}
              tooltip="Add Link"
            >
              <LinkIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              tooltip="Clear Formatting"
            >
              <ClearFormatIcon fontSize="small" />
            </ToolbarButton>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* History Group */}
          <ButtonGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              tooltip="Undo (Ctrl+Z)"
            >
              <UndoIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              tooltip="Redo (Ctrl+Y)"
            >
              <RedoIcon fontSize="small" />
            </ToolbarButton>
          </ButtonGroup>
        </Toolbar>

        {/* Editor Content */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            '& .ProseMirror': {
              outline: 'none',
              '& p.is-editor-empty:first-child::before': {
                color: 'text.disabled',
                content: `attr(data-placeholder)`,
                float: 'left',
                height: 0,
                pointerEvents: 'none',
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                bgcolor: alpha('#1976d2', 0.05),
                margin: '1rem 0',
                paddingLeft: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
              },
              '& code': {
                bgcolor: alpha('#1976d2', 0.1),
                color: 'primary.main',
                padding: '0.2em 0.4em',
                borderRadius: '0.25rem',
                fontSize: '0.875em',
              },
              '& pre': {
                bgcolor: alpha('#000', 0.05),
                borderRadius: '0.5rem',
                padding: '1rem',
                overflow: 'auto',
                '& code': {
                  bgcolor: 'transparent',
                  color: 'inherit',
                  padding: 0,
                },
              },
              '& ul, & ol': {
                paddingLeft: '1.5rem',
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 600,
                lineHeight: 1.3,
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
                '&:first-child': {
                  marginTop: 0,
                },
              },
              '& h1': { fontSize: '2rem' },
              '& h2': { fontSize: '1.75rem' },
              '& h3': { fontSize: '1.5rem' },
              '& h4': { fontSize: '1.25rem' },
              '& h5': { fontSize: '1.125rem' },
              '& h6': { fontSize: '1rem' },
              '& p': {
                marginBottom: '0.75rem',
                '&:last-child': {
                  marginBottom: 0,
                },
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'primary.dark',
                },
              },
              '& mark': {
                bgcolor: alpha('#ffeb3b', 0.4),
                padding: '0.1em 0.2em',
                borderRadius: '0.2em',
              },
            },
          }}
        >
          <EditorContent
            editor={editor}
            style={{
              minHeight,
              maxHeight,
              alignItems: 'left',
              textAlign: 'left',
              overflowY: maxHeight ? 'auto' : 'visible',
            }}
          />
        </Box>
      </Paper>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Link URL"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <TextField
              fullWidth
              label="Link Text"
              placeholder="Link text (optional)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmAddLink} variant="contained" disabled={!linkUrl}>
            Add Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
