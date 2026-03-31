import type { GameState } from "../models/game";

function formatExpiry(expiration: number): string {
	const now = Math.floor(Date.now() / 1000);
	const diff = expiration - now;
	if (diff <= 0) return "Expired";
	const h = Math.floor(diff / 3600);
	const m = Math.floor((diff % 3600) / 60);
	return `${h}h ${m}m`;
}

export function GameStatus({ game }: { game: GameState }) {
	return (
		<div className="header">
			<h1>NUMS #{game.id}</h1>
			<div className="stats">
				<div>
					Level <span>{game.level}/18</span>
				</div>
				<div>
					Reward <span>{game.reward.toFixed(1)} NUMS</span>
				</div>
				<div>
					Mult <span>{game.multiplier.toFixed(2)}×</span>
				</div>
				{game.over === 0 && game.expiration > 0 && (
					<div>
						Expires <span>{formatExpiry(game.expiration)}</span>
					</div>
				)}
				<span className={`phase-badge phase-${game.phase}`}>{game.phase.replace("_", " ")}</span>
			</div>
		</div>
	);
}
