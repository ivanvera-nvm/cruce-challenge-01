import { useEffect, useRef, type RefObject } from "react";

interface ScrollInfo {
	scrollTop: number;
	scrollHeight: number;
	clientHeight: number;
}

interface UseSyncScrollProps {
	editorRef: RefObject<any>;
	previewRef: RefObject<any>;
	isEnabled: boolean;
}

export function useSyncScroll({ editorRef, previewRef, isEnabled }: UseSyncScrollProps) {
	const isScrollingEditor = useRef(false);
	const isScrollingPreview = useRef(false);

	const getScrollInfo = (element: HTMLElement): ScrollInfo => ({
		scrollTop: element.scrollTop,
		scrollHeight: element.scrollHeight,
		clientHeight: element.clientHeight,
	});

	const calculateScrollPosition = (source: ScrollInfo, target: ScrollInfo, currentScroll: number): number => {
		const sourceScrollableHeight = source.scrollHeight - source.clientHeight;
		const targetScrollableHeight = target.scrollHeight - target.clientHeight;

		if (sourceScrollableHeight <= 0) return 0;

		const scrollRatio = currentScroll / sourceScrollableHeight;
		return Math.round(scrollRatio * targetScrollableHeight);
	};

	useEffect(() => {
		if (!isEnabled || !editorRef.current || !previewRef.current) return;

		const handleEditorScroll = () => {
			if (!isEnabled || isScrollingPreview.current || !editorRef.current || !previewRef.current) return;

			isScrollingEditor.current = true;

			const editorInfo = getScrollInfo(editorRef.current);
			const previewInfo = getScrollInfo(previewRef.current);

			previewRef.current.scrollTop = calculateScrollPosition(editorInfo, previewInfo, editorInfo.scrollTop);

			setTimeout(() => {
				isScrollingEditor.current = false;
			}, 50);
		};

		const handlePreviewScroll = () => {
			if (!isEnabled || isScrollingEditor.current || !editorRef.current || !previewRef.current) return;

			isScrollingPreview.current = true;

			const editorInfo = getScrollInfo(editorRef.current);
			const previewInfo = getScrollInfo(previewRef.current);

			editorRef.current.scrollTop = calculateScrollPosition(previewInfo, editorInfo, previewInfo.scrollTop);

			setTimeout(() => {
				isScrollingPreview.current = false;
			}, 50);
		};

		editorRef.current.addEventListener("scroll", handleEditorScroll);
		previewRef.current.addEventListener("scroll", handlePreviewScroll);

		return () => {
			editorRef.current?.removeEventListener("scroll", handleEditorScroll);
			previewRef.current?.removeEventListener("scroll", handlePreviewScroll);
		};
	}, [isEnabled]);
}
