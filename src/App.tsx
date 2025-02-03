import ThemeToggle from "./components/ui/theme-toggle";
import Preview from "./components/Preview";
import Editor from "./components/Editor";
import useLocalStorage from "./hooks/useLocalStorage";
import { useRef, useState } from "react";
import { useResize } from "./hooks/useResize";
import { EXAMPLE_MARKDOWN, STORAGE_KEY } from "./constants";
import { useSyncScroll } from "./hooks/useSyncScroll";
export default function App() {
	const [mdContent, setMdContent] = useLocalStorage<string>(STORAGE_KEY, EXAMPLE_MARKDOWN);
	const containerRef = useRef<HTMLDivElement>(null);
	const initialWidth = window.innerWidth / 2;

	const { width: editorWidth, handleMouseDown } = useResize(containerRef, initialWidth, 600);

	const [isSyncEnabled, setIsSyncEnabled] = useState(true);
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);

	useSyncScroll({
		editorRef,
		previewRef,
		isEnabled: isSyncEnabled,
	});

	const handleReset = () => {
		localStorage.removeItem(STORAGE_KEY);
		setMdContent(EXAMPLE_MARKDOWN);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(mdContent);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleEditorChange = (newContent: string) => {
		setMdContent(newContent);
	};

	return (
		<main className="h-screen flex flex-col text-sm transition-colors overflow-hidden">
			<header className="p-4 flex-shrink-0 border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700">
				<div className="flex gap-2">
					<ThemeToggle />
					<button
						type="button"
						onClick={handleReset}
						className="text-neutral-900 hover:text-white border border-neutral-800 hover:bg-neutral-900 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm px-4 py-1 text-center dark:border-neutral-600 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-800"
					>
						Reiniciar
					</button>
					<button
						type="button"
						onClick={handleCopy}
						className="text-neutral-900 hover:text-white border border-neutral-800 hover:bg-neutral-900 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm px-4   py-1 text-center  dark:border-neutral-600 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-800"
					>
						Copiar
					</button>

					<div className="flex items-center px-4 py-2">
						<input
							id="sync-scroll-checkbox"
							type="checkbox"
							checked={isSyncEnabled}
							onChange={(e) => setIsSyncEnabled(e.target.checked)}
							className="w-4 h-4 accent-amber-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
						/>
						<label htmlFor="sync-scroll-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
							Sincronizar scroll
						</label>
					</div>
				</div>
			</header>

			<div ref={containerRef} className="flex flex-1 overflow-hidden">
				<div className="h-full" style={{ width: editorWidth }}>
					<Editor markdownContent={mdContent} onChange={handleEditorChange} ref={editorRef} />
				</div>

				<div
					className="w-2 bg-neutral-200 dark:bg-dark-accent cursor-col-resize transition-colors flex-shrink-0"
					onMouseDown={handleMouseDown}
				/>

				<div className="h-full flex-1">
					<Preview content={mdContent} ref={previewRef} />
				</div>
			</div>
		</main>
	);
}
