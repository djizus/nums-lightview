import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
	const navigate = useNavigate();
	const [gameId, setGameId] = useState("");

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const parsed = Number.parseInt(gameId, 10);
		if (Number.isNaN(parsed) || parsed <= 0) return;
		navigate(`/game/${parsed}`);
	};

	return (
		<div className="h-full w-full flex items-center justify-center p-6">
			<div className="w-full max-w-md rounded-xl border border-black-700 bg-black-900/70 p-6 md:p-8">
				<h1 className="text-white-100 text-4xl tracking-wider mb-3">NUMS Lightview</h1>
				<p className="text-primary-100 mb-6">Enter a game ID to watch a live board.</p>
				<form onSubmit={onSubmit} className="flex gap-2">
					<input
						value={gameId}
						onChange={(event) => setGameId(event.target.value)}
						inputMode="numeric"
						placeholder="Game ID"
						className="flex-1 h-11 rounded-lg border border-black-700 bg-black-800 px-3 text-white-100 outline-none focus:border-primary-100"
					/>
					<button type="submit" className="h-11 rounded-lg bg-primary-700 px-4 text-white-100 hover:bg-primary-500">
						Watch
					</button>
				</form>
			</div>
		</div>
	);
};
