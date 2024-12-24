"use client";

import { Separator } from "@/components/ui/separator";
import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BoldToolbar } from "@/components/toolbars/bold";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { RedoToolbar } from "@/components/toolbars/redo";
import { StrikeThroughToolbar } from "@/components/toolbars/strike";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { UndoToolbar } from "@/components/toolbars/undo";
import {HeadingToolbar} from "@/components/toolbars/headings";
import SearchAndReplace from "@/components/extensions/search-and-replace";
import { SearchAndReplaceToolbar } from "@/components/toolbars/search-and-replace-toolbar";
import { ImageExtension } from "@/components/extensions/image";
import { ImagePlaceholder } from "@/components/extensions/image-placeholder";
import { ImagePlaceholderToolbar } from "@/components/toolbars/image-placeholder-toolbar";
import { Editor, EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createClient } from "@/lib/supabase/client";
import {toast} from "sonner"
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
	ImagePlaceholder.configure({
        onDrop: async(file,editor) => {
            
            file.map(async (file) => {
                const fileName=`${Date.now()}-${file.name}`
                const { data, error } = await supabase.storage.from("editor-images").upload(fileName, file)
                if (error) {
                    console.log(error)
                    toast('Image upload failed')
                } else {
                    const {data:{publicUrl}}=await supabase.storage.from("editor-images").getPublicUrl(fileName)
                    const {data,error}=await supabase.from("editor-images").insert({url:publicUrl})
                    editor.chain().focus().setImage({src:publicUrl}).run()
                    toast('Image uploaded successfully')
                }
            }
            )
        },
        onEmbed: async (url, editor) => {
            
            const {data,error}=await supabase.from("editor-images").insert({url})
            if(error){
                console.log(error)
                toast('Image upload failed')
            }
            else{
                editor.chain().focus().setImage({src:url}).run()
                toast('Image uploaded successfully')
            }
        },
    })
];

const content = `
<h2 class="tiptap-heading" style="text-align: center">Hello world 🌍</h2>
`;
type Props = {
    content?: string
    onChange?: (editor: Editor) => void
    isEditable?: boolean
}

const TipTapEditor = ({content,onChange,isEditable=true}:Props) => {
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
			<div className="flex w-full items-center py-2 px-2 justify-between border-b  sticky top-0 left-0 bg-background z-20">
				<ToolbarProvider editor={editor}>
					<div className="flex items-center gap-2">

						<UndoToolbar />
						<RedoToolbar />
						<Separator orientation="vertical" className="h-7" />
                        <HeadingToolbar />
						<BoldToolbar />
						<ItalicToolbar />
						<StrikeThroughToolbar />
						<BulletListToolbar />
						<OrderedListToolbar />
						<CodeToolbar />
						<CodeBlockToolbar />
						<HorizontalRuleToolbar />
						<BlockquoteToolbar />
						<HardBreakToolbar />
                        <SearchAndReplaceToolbar />
                        <ImagePlaceholderToolbar />
					</div>
				</ToolbarProvider>
			</div>
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

export default TipTapEditor;