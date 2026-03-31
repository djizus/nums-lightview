export enum TrapType {
	None = 0,
	Bomb = 1,
	Lucky = 2,
	Magnet = 3,
	UFO = 4,
	Windy = 5,
}

export enum PowerType {
	None = 0,
	Reroll = 1,
	High = 2,
	Low = 3,
	Swap = 4,
	DoubleUp = 5,
	Halve = 6,
	Mirror = 7,
}

export const TRAP_EMOJI: Record<number, string> = {
	[TrapType.Bomb]: "💣",
	[TrapType.Lucky]: "🍀",
	[TrapType.Magnet]: "🧲",
	[TrapType.UFO]: "🛸",
	[TrapType.Windy]: "💨",
};

export const TRAP_CLASS: Record<number, string> = {
	[TrapType.Bomb]: "trap-bomb",
	[TrapType.Lucky]: "trap-lucky",
	[TrapType.Magnet]: "trap-magnet",
	[TrapType.UFO]: "trap-ufo",
	[TrapType.Windy]: "trap-windy",
};

export const POWER_NAME: Record<number, string> = {
	[PowerType.Reroll]: "Reroll",
	[PowerType.High]: "High",
	[PowerType.Low]: "Low",
	[PowerType.Swap]: "Swap",
	[PowerType.DoubleUp]: "Double Up",
	[PowerType.Halve]: "Halve",
	[PowerType.Mirror]: "Mirror",
};

export interface GameState {
	id: number;
	claimed: boolean;
	multiplier: number;
	level: number;
	slotCount: number;
	number: number;
	nextNumber: number;
	selectablePowers: number[];
	selectedPowers: number[];
	enabledPowers: boolean[];
	disabledTraps: boolean[];
	reward: number;
	over: number;
	expiration: number;
	traps: number[];
	slots: number[];
	phase: string;
}

const SLOT_SIZE = 12n;
const MULTIPLIER_PRECISION = 1_000_000;
const DEFAULT_SLOT_COUNT = 18;
const DEFAULT_POWER_COUNT = 3;

function sizedUnpack(packed: bigint, size: bigint, len: number): number[] {
	const result: number[] = [];
	const mask = (1n << size) - 1n;
	let v = packed;
	for (let i = 0; i < len; i++) {
		result.push(Number(v & mask));
		v >>= size;
	}
	return result;
}

function unpackPowers(bitmap: bigint): number[] {
	const result: number[] = [];
	const mask = 0xfn;
	let v = bitmap;
	while (v > 0n) {
		const val = Number(v & mask);
		if (val !== 0) result.push(val);
		v >>= 4n;
	}
	return result;
}

export function computePhase(state: GameState): string {
	if (state.over !== 0 && state.claimed) return "claimed";
	if (state.over !== 0) return "game_over";
	if (state.selectablePowers.length > 0) return "power_selection";
	if (state.number !== 0) return "active";
	return "purchasing";
}

export function getValidSlots(slots: number[], num: number): number[] {
	if (num === 0) return [];
	const valid: number[] = [];
	let closestLow = -1;
	let closestHigh = -1;

	for (let i = slots.length - 1; i >= 0; i--) {
		if (slots[i] !== 0 && slots[i] <= num) {
			closestLow = i;
			break;
		}
	}
	for (let i = 0; i < slots.length; i++) {
		if (slots[i] !== 0 && slots[i] >= num) {
			closestHigh = i;
			break;
		}
	}

	const lo = closestLow === -1 ? -1 : closestLow;
	const hi = closestHigh === -1 ? slots.length : closestHigh;

	for (let i = lo + 1; i < hi; i++) {
		if (slots[i] === 0) valid.push(i);
	}
	return valid;
}

interface RawGameFields {
	id: { value: string | number };
	claimed: { value: boolean | number | string };
	multiplier: { value: string | number };
	level: { value: string | number };
	slot_count: { value: string | number };
	number: { value: string | number };
	next_number: { value: string | number };
	selectable_powers: { value: string | number };
	selected_powers: { value: string | number };
	enabled_powers: { value: string | number };
	disabled_traps: { value: string | number };
	reward: { value: string | number };
	over: { value: string | number };
	expiration: { value: string | number };
	traps: { value: string | number };
	slots: { value: string | number };
}

export function parseRawGame(data: RawGameFields): GameState {
	const slotCount = Number(data.slot_count.value);
	const slots = sizedUnpack(BigInt(data.slots.value), SLOT_SIZE, slotCount);
	const traps = sizedUnpack(BigInt(data.traps.value), 4n, slotCount);
	const selectablePowers = unpackPowers(BigInt(data.selectable_powers.value));
	const selectedPowers = unpackPowers(BigInt(data.selected_powers.value));
	const enabledPowers = sizedUnpack(BigInt(data.enabled_powers.value), 1n, DEFAULT_POWER_COUNT).map((v) => v === 1);
	const disabledTraps = sizedUnpack(BigInt(data.disabled_traps.value), 1n, slotCount).map((v) => v === 1);

	const state: GameState = {
		id: Number(data.id.value),
		claimed: !!data.claimed.value,
		multiplier: Number(data.multiplier.value) / MULTIPLIER_PRECISION,
		level: Number(data.level.value),
		slotCount,
		number: Number(data.number.value),
		nextNumber: Number(data.next_number.value),
		selectablePowers,
		selectedPowers,
		enabledPowers,
		disabledTraps,
		reward: Number(BigInt(data.reward.value) / 10n ** 18n),
		over: Number(data.over.value),
		expiration: Number(data.expiration.value),
		traps,
		slots,
		phase: "",
	};
	state.phase = computePhase(state);
	return state;
}
