import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, ContentState } from 'draft-js';

import css from './style.css';

function PlaintextEditor({ file, write }) {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );
  const [currentText, setCurrentText] = useState(null);
 
  useEffect(() => {
    (async function() {
      const fileText = await file.text();
      setCurrentText(fileText);
      if (fileText?.length) {
        setEditorState(EditorState.createWithContent(ContentState.createFromText(fileText)));
      }
    })();
  }, [file.name]);

  const writeToFileAndUpdateEditorState = editorState => {
    const cText = editorState.getCurrentContent().getPlainText();
    if (cText !== currentText) {
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
      <Editor
        editorState={editorState}
        onChange={writeToFileAndUpdateEditorState}
      />
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
