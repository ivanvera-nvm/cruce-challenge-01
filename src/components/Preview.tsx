import { forwardRef } from "react";
import { MarkdownParser } from "../parser";

type Props = {
	content: string;
};

export default forwardRef<HTMLDivElement, Props>(function Preview({ content }, ref) {
	const parser = new MarkdownParser();
	const parsedContent = parser.parse(content);

	return (
		<div
			ref={ref}
			className="prose dark:prose-invert dark:bg-neutral-900 p-4 h-full w-full min-w-full overflow-auto"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Usamos el prop `dangerouslySetInnerHTML` porque es una implementación muy simple.
			dangerouslySetInnerHTML={{ __html: parsedContent }}
		/>
	);
});
