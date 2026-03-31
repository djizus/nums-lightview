import type { GameState } from "../models/game";
import { POWER_NAME } from "../models/game";

export function Powers({ game }: { game: GameState }) {
	const hasSelectablePowers = game.selectablePowers.length > 0;
	const hasSelectedPowers = game.selectedPowers.length > 0;

	if (!hasSelectablePowers && !hasSelectedPowers) return null;

	return (
		<div className="powers">
			{hasSelectablePowers && (
				<>
					<span style={{ fontSize: "0.7rem", color: "#888", alignSelf: "center" }}>Choose:</span>
					{game.selectablePowers.map((p, i) => (
						<span key={`sel-${i}`} className="power-badge selectable">
							{POWER_NAME[p] ?? `Power ${p}`}
						</span>
					))}
				</>
			)}
			{hasSelectedPowers &&
				game.selectedPowers.map((p, i) => {
					const isEnabled = game.enabledPowers[i] ?? false;
					return (
						<span key={`pow-${i}`} className={`power-badge ${isEnabled ? "enabled" : "used"}`}>
							{POWER_NAME[p] ?? `Power ${p}`}
							{isEnabled ? " ✓" : " ✗"}
						</span>
					);
				})}
		</div>
	);
}
