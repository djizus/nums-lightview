import { createDojoConfig } from "@dojoengine/core";
import manifestMainnet from "../../manifest_mainnet.json";
import manifestSepolia from "../../manifest_sepolia.json";

export const DEFAULT_CHAIN = import.meta.env.VITE_DEFAULT_CHAIN;

export const SEPOLIA_CHAIN_ID = "0x534e5f5345504f4c4941";
export const MAINNET_CHAIN_ID = "0x534e5f4d41494e";

export const DEFAULT_CHAIN_ID = DEFAULT_CHAIN === "SN_MAIN" ? MAINNET_CHAIN_ID : SEPOLIA_CHAIN_ID;

const dojoConfigSepolia = createDojoConfig({
	rpcUrl: import.meta.env.VITE_SN_SEPOLIA_RPC_URL,
	toriiUrl: import.meta.env.VITE_SN_SEPOLIA_TORII_URL,
	manifest: manifestSepolia,
});

const dojoConfigMainnet = createDojoConfig({
	rpcUrl: import.meta.env.VITE_SN_MAIN_RPC_URL,
	toriiUrl: import.meta.env.VITE_SN_MAIN_TORII_URL,
	manifest: manifestMainnet,
});

export const dojoConfigs = {
	[SEPOLIA_CHAIN_ID]: dojoConfigSepolia,
	[MAINNET_CHAIN_ID]: dojoConfigMainnet,
};
