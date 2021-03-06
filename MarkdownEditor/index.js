import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { markdownToDraft } from 'markdown-draft-js';
import { Editor, EditorState, ContentState, convertFromRaw } from 'draft-js';

import css from './style.css';

function MarkdownEditor({ file, write }) {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );
  const [currentText, setCurrentText] = useState(null);

  const [markDown, setMarkdown] = useState(null);

  const [isPreview, setPreview] = useState(false);
  
  useEffect(() => {
    (async function() {
      const fileText = await file.text();
      setCurrentText(fileText);
      if (fileText?.length) {
        const rawData = markdownToDraft(fileText);
        const contentState = convertFromRaw(rawData);
        const newEditorState = EditorState.createWithContent(contentState);
        setMarkdown(newEditorState);
        setEditorState(EditorState.createWithContent(ContentState.createFromText(fileText)));
      }
    })();
  }, [file.name]);

  const writeToFileAndUpdateEditorState = editorState => {
    const cText = editorState.getCurrentContent().getPlainText();
    if (cText !== currentText) {
      const rawData = markdownToDraft(cText);
      const contentState = convertFromRaw(rawData);
      const newEditorState = EditorState.createWithContent(contentState);
      setMarkdown(newEditorState);
      setCurrentText(cText);
      write(new File([cText || 'No Text Edit Me'], file.name, {
        type: file.type,
        lastModified: new Date(),
      }));
    }
    setEditorState(editorState)
  }

  return (
    <div className={css.editor}>
      {
      isPreview && 
      <Editor editorState={markDown} readOnly={true}/>
      || 
      <Editor
        editorState={editorState}
        onChange={writeToFileAndUpdateEditorState}
      />
      }
      <button className={css.button} onClick={() => setPreview(!isPreview)}>{isPreview ? 'View Editor' : 'View Preview'}</button>
    </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
