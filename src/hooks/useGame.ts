import { useEffect, useRef, useState } from "react";
import { fetchGame, fetchGameSQL } from "../api/torii";
import type { GameState } from "../models/game";

export function useGame(gameId: number | null) {
	const [game, setGame] = useState<GameState | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (gameId === null || Number.isNaN(gameId)) {
			setLoading(false);
			setError("Invalid game ID");
			return;
		}

		let cancelled = false;

		async function load() {
			const state = (await fetchGame(gameId!)) ?? (await fetchGameSQL(gameId!));
			if (cancelled) return;

			if (state) {
				setGame(state);
				setError(null);
			} else if (!game) {
				setError("Game not found");
			}
			setLoading(false);
		}

		load();

		intervalRef.current = setInterval(load, 3000);

		return () => {
			cancelled = true;
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [gameId]);

	return { game, loading, error };
}
