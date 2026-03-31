import type { PowerUpProps } from "@/components/elements/power-up";
import type { StageState } from "@/components/elements/stage";
import { GameScene } from "@/components/scenes/game";
import { LoadingScene } from "@/components/scenes/loading";
import { DEFAULT_POWER_COUNT } from "@/constants";
import { useEntities } from "@/context/entities";
import { useGame } from "@/context/games";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const buildStages = (level: number, slotCount: number): StageState[] => {
	return Array.from({ length: slotCount }, (_, index) => {
		const stageLevel = index + 1;
		return {
			completed: stageLevel <= level,
			gem: stageLevel % 4 === 0 && stageLevel <= 15,
			crown: stageLevel === slotCount,
		};
	});
};

const buildPowers = (selectedPowers: PowerUpProps["power"][], enabledPowers: boolean[]): PowerUpProps[] => {
	return Array.from({ length: DEFAULT_POWER_COUNT }, (_, index) => {
		const power = selectedPowers[index];
		if (!power || power.isNone()) {
			return { power: undefined, disabled: true };
		}

		return {
			power,
			status: enabledPowers[index] ? undefined : "used",
			disabled: true,
		};
	});
};

export const Game = () => {
	const { status } = useEntities();
	const { id } = useParams<{ id: string }>();

	const gameId = useMemo(() => {
		if (!id) return null;
		const parsed = Number.parseInt(id, 10);
		return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
	}, [id]);

	const game = useGame(gameId);

	if (!gameId) {
		return (
			<div className="h-full w-full flex items-center justify-center p-6 text-center text-white-100">
				<p className="text-2xl tracking-wider">Game not found</p>
			</div>
		);
	}

	if (!game) {
		if (status === "success") {
			return (
				<div className="h-full w-full flex items-center justify-center p-6 text-center text-white-100">
					<p className="text-2xl tracking-wider">Game not found</p>
				</div>
			);
		}
		return <LoadingScene />;
	}

	const powers = buildPowers(game.selected_powers, game.enabled_powers);
	const slots = game.slots.map((slot, index) => ({
		value: slot,
		trap: game.getTrap(index),
		inactive: game.isInactive(index),
		disabled: true,
	}));
	const stages = buildStages(game.level, game.slot_count);

	return (
		<div className="h-full w-full flex flex-col items-center justify-center p-4 gap-4">
			<div className="w-full max-w-[720px] grid grid-cols-2 md:grid-cols-4 gap-2 text-primary-100 text-sm md:text-base uppercase tracking-wider">
				<div className="rounded bg-black-800 px-3 py-2">Game #{game.id}</div>
				<div className="rounded bg-black-800 px-3 py-2">Level {game.level}</div>
				<div className="rounded bg-black-800 px-3 py-2">Reward {game.reward}</div>
				<div className="rounded bg-black-800 px-3 py-2">x{game.multiplier.toFixed(2)}</div>
			</div>

			<GameScene
				game={game}
				multiplier={game.multiplier}
				powers={powers}
				slots={slots}
				stages={stages}
				className="md:max-h-[588px] p-4 md:px-0 md:py-0"
			/>
		</div>
	);
};
