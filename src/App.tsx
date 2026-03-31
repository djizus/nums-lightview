import { Route, Routes, useParams } from "react-router-dom";
import { Board } from "./components/Board";
import { GameStatus } from "./components/GameStatus";
import { Powers } from "./components/Powers";
import { useGame } from "./hooks/useGame";

function GameView() {
	const { id } = useParams<{ id: string }>();
	const gameId = id ? Number(id) : null;
	const { game, loading, error } = useGame(gameId);

	if (loading) return <div className="loading">Loading game #{id}...</div>;
	if (error) return <div className="error">{error}</div>;
	if (!game) return <div className="error">Game not found</div>;

	return (
		<div className="game-container">
			<GameStatus game={game} />
			<Board game={game} />
			<Powers game={game} />
		</div>
	);
}

function Landing() {
	return (
		<div className="landing">
			<h1>🔢 NUMS Lightview</h1>
			<p>Navigate to /game/&#123;id&#125; to spectate a game</p>
		</div>
	);
}

export function App() {
	return (
		<Routes>
			<Route path="/game/:id" element={<GameView />} />
			<Route path="*" element={<Landing />} />
		</Routes>
	);
}
