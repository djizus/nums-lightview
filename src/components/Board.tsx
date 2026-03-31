import type { GameState } from "../models/game";
import { TRAP_CLASS, TRAP_EMOJI, TrapType, getValidSlots } from "../models/game";

export function Board({ game }: { game: GameState }) {
	const validSlots = new Set(getValidSlots(game.slots, game.number));

	return (
		<>
			<div className="current-number">
				{game.phase === "active" || game.phase === "power_selection" ? (
					<>
						<div className="number">{game.number}</div>
						<div className="next">next: {game.nextNumber}</div>
					</>
				) : game.phase === "game_over" || game.phase === "claimed" ? (
					<div className="next">Game Over — Level {game.level}/18</div>
				) : (
					<div className="next">Waiting for game start...</div>
				)}
			</div>

			<div className="board">
				{game.slots.map((value, i) => {
					const trap = game.traps[i];
					const hasTrap = trap !== TrapType.None;
					const isFired = game.disabledTraps[i];
					const isFilled = value !== 0;
					const isValid = validSlots.has(i);

					const classes = ["slot"];
					if (isFilled) classes.push("filled");
					if (isValid) classes.push("valid");

					return (
						<div key={i} className={classes.join(" ")}>
							<span className="index">{i}</span>
							{isFilled ? (
								<span className="value">{value}</span>
							) : (
								<span className="value" style={{ opacity: 0.15 }}>
									—
								</span>
							)}
							{hasTrap && (
								<span className={`trap-icon ${TRAP_CLASS[trap] ?? ""} ${isFired ? "fired" : ""}`}>
									{TRAP_EMOJI[trap]}
								</span>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
}
