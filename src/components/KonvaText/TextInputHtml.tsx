import { VFC, useState, useEffect, memo } from 'react';
import { Html } from 'react-konva-utils';
import { textHtmlProps } from 'src/content/pages/Orders/receipt';
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { styled } from '@mui/material';
import { INITIAL_IMAGE_HEIGHT } from 'src/constant/index';

interface TextInputHtmlProps {
  textProps: textHtmlProps;
  isEditing: boolean;
}

const EditorWrapper = styled('div')<{
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing: boolean;
}>(({ x, y, width, height, isEditing }) => ({
  display: isEditing ? 'block' : 'none',
  '.wrapperClassName': {},
  '.toolbarClassName': {
    position: 'absolute',
    width: '700px',
    top: `${INITIAL_IMAGE_HEIGHT - y + 40}px`,
    left: `${-x + 70}px`
  },
  '.editorClassName': {
    position: 'absolute',
    width,
    height,
    fontSize: 18
  },
  '.public-DraftStyleDefault-block': {
    margin: '0'
  }
}));

const TextInputHtml: VFC<TextInputHtmlProps> = memo(
  ({ textProps, isEditing }) => {
    const [editorState, setEditorState] = useState<EditorState>(
      EditorState.createEmpty()
    );

    const onEditorStateChange = (e: EditorState) => {
      setEditorState(e);

      if (textProps.htmlRef.current !== null) {
        textProps.htmlRef.current.innerHTML = draftToHtml(
          convertToRaw(e.getCurrentContent())
        );
      }
    };

    useEffect(() => {
      if (textProps.initialHtml !== undefined) {
        const blocksFromHtml = htmlToDraft(textProps.initialHtml);
        const { contentBlocks, entityMap } = blocksFromHtml;

        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(contentBlocks, entityMap)
          )
        );
      }
    }, [textProps.initialHtml, setEditorState]);

    return (
      <Html groupProps={{ x: textProps.x, y: textProps.y }}>
        <EditorWrapper
          x={textProps.x}
          y={textProps.y}
          width={textProps.width}
          height={textProps.height}
          isEditing={isEditing}
        >
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: [
                'inline',
                'blockType',
                'list',
                'fontFamily',
                'history',
                'fontSize'
              ],
              inline: {
                options: ['bold', 'italic', 'underline']
              },
              list: {
                options: ['unordered', 'ordered']
              },
              fontSize: {
                options: [...Array(20).keys()].map((i) => ++i + 10)
              }
            }}
          />
        </EditorWrapper>
      </Html>
    );
  }
);

export default TextInputHtml;
