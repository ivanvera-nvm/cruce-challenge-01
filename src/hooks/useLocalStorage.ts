import { useState, useEffect } from "react";

/**
 * Lee el valor de una clave en localStorage.
 *
 * @param key - La clave a leer.
 * @param defaultValue - El valor por defecto si no existe el item.
 * @returns El valor del item o el defaultValue si no existe.
 */
function readLocalStorage<T>(key: string, defaultValue: T): T {
	if (typeof window === "undefined") return defaultValue;

	try {
		const item = window.localStorage.getItem(key);
		if (item === null) return defaultValue;
		return JSON.parse(item) as T;
	} catch (error) {
		console.warn(`Error leyendo la clave "${key}" de localStorage:`, error);
		return defaultValue;
	}
}

/**
 * Hook para sincronizar datos con el localStorage.
 *
 * @param key - La clave en localStorage.
 * @param defaultValue - Valor por defecto si no existe el item.
 * @returns Una tupla con el valor actual y una función para actualizarlo.
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
	const [storedValue, setStoredValue] = useState<T>(readLocalStorage(key, defaultValue));

	/**
	 * Actualiza el estado y sincroniza el valor en localStorage.
	 *
	 * @param value - El nuevo valor o una función de actualización.
	 */
	const setValue = (value: T | ((prev: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			if (typeof window === "undefined") return;
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.warn(`Error seteando la clave "${key}" en localStorage:`, error);
		}
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleStorageChange = (event: StorageEvent) => {
			if (event.key !== key) return;

			try {
				if (!event.newValue) {
					setStoredValue(defaultValue);
					return;
				}

				setStoredValue(JSON.parse(event.newValue) as T);
			} catch (error) {
				console.warn(`Error parseando la clave "${key}" de localStorage:`, error);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [key, defaultValue]);

	return [storedValue, setValue] as const;
}

export default useLocalStorage;
