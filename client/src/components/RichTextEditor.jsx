import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

function RichTextEditor({input, setInput}) {
const handleChange = (content) => {
    setInput({...input, description:content});
}
  return (
    <div data-color-mode="light" className="container">
      <MDEditor
        value={input.description}
        onChange={handleChange}
      />
      <h3>Output Preview:</h3>
      <MDEditor.Markdown source={input.description} />
    </div>
  );
}

export default RichTextEditor;