"use client";
import SearchAndReplace from "@/components/extensions/search-and-replace";
import { ImageExtension } from "@/components/extensions/image";
import { ImagePlaceholder } from "@/components/extensions/image-placeholder";

import { Editor, EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createClient } from "@/lib/supabase/client";

const supabase=createClient()
const extensions = [
	StarterKit.configure({
		orderedList: {
			HTMLAttributes: {
				class: "list-decimal",
			},
		},
		bulletList: {
			HTMLAttributes: {
				class: "list-disc",
			},
		},
		code: {
			HTMLAttributes: {
				class: "bg-accent rounded-md p-1",
			},
		},
		horizontalRule: {
			HTMLAttributes: {
				class: "my-2",
			},
		},
		codeBlock: {
			HTMLAttributes: {
				class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
			},
		},
		heading: {
			levels: [1, 2, 3, 4],
			HTMLAttributes: {
				class: "tiptap-heading",
			},
		},
        
	}),
    SearchAndReplace,
    ImageExtension,
    ImagePlaceholder,
];

type Props = {
    content?: string
    onChange?: (editor: Editor) => void
    isEditable?: boolean
}

const TipTapEditorPreview = ({content,onChange,isEditable}:Props) => {
	const editor = useEditor({
		extensions: extensions as Extension[],
		content,
		immediatelyRender: false,
        onUpdate: ({ editor }) => {
            console.log(editor.getHTML())
			onChange?.(editor)
        },
        editable: isEditable,
	});

	if (!editor) {
		return null;
	}
    
	return (
		<div className="border w-full relative rounded-md overflow-hidden pb-3">
			<div
				onClick={() => {
					editor?.chain().focus().run();
				}}
				className="cursor-text min-h-[18rem] bg-background"
			>
				<EditorContent 
                className="outline-none" editor={editor} />
			</div>
		</div>
	);
};

export default TipTapEditorPreview;