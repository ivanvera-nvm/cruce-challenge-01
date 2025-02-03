import { forwardRef } from "react";

type Props = {
	markdownContent: string;
	onChange: (content: string) => void;
};

export default forwardRef<HTMLTextAreaElement, Props>(function Editor({ markdownContent, onChange }, ref) {
	return (
		<div className="h-full relative">
			<textarea
				ref={ref}
				value={markdownContent}
				onChange={(e) => onChange(e.target.value)}
				className="absolute inset-0 w-full h-full resize-none px-4 font-mono focus:outline-none dark:bg-dark-bg dark:text-dark-fg"
				spellCheck={false}
			/>
		</div>
	);
});
