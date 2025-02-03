import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("theme") === "dark";
	});

	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDark]);

	return (
		<button
			type="button"
			onClick={() => setIsDark(!isDark)}
			className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
			aria-label="Alternar tema"
		>
			{isDark ? (
				<Sun className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
			) : (
				<Moon className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
			)}
		</button>
	);
};

export default ThemeToggle;
