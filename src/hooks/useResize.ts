import { useState, useRef, useEffect, type RefObject } from "react";

/**
 * Hook para controlar el tamaño del editor y permitir redimensionarlo.
 *
 * @param containerRef - Ref al elemento contenedor.
 * @param initialWidth - Ancho inicial del editor.
 * @param minWidth - Ancho mínimo del editor.
 * @returns Ancho del editor y una función para redimensionarlo.
 */
export function useResize(containerRef: RefObject<any> | null, initialWidth: number, minWidth = 200) {
	const [width, setWidth] = useState(initialWidth);
	const isResizing = useRef(false);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizing.current || !containerRef?.current) return;

			const containerLeft = containerRef.current.getBoundingClientRect().left;
			let newWidth = e.clientX - containerLeft;
			if (newWidth < minWidth) newWidth = minWidth;
			setWidth(newWidth);
		};

		const handleMouseUp = () => {
			isResizing.current = false;
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [containerRef, minWidth]);

	const handleMouseDown = () => {
		isResizing.current = true;
	};

	return { width, handleMouseDown };
}
