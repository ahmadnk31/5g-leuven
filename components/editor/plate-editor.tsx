'use client';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { TNode } from '@udecode/slate';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate-common/react';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { SettingsDialog } from '@/components/editor/settings';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
type PlateEditorProps = {
  // Add your own props
  content:string
};
export function PlateEditor() {
  const editor = useCreateEditor();
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Plate 
      onChange={(newValue) => {
        console.log('PlateEditor', newValue)
       
      }}
      editor={editor}>
        <EditorContainer>
          <Editor variant="demo" />
        </EditorContainer>

        <SettingsDialog />
      </Plate>
    </DndProvider>
  );
}
