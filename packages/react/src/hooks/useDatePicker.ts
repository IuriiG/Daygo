import { createDatePicker } from "@daygo/core";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { useConst } from "./useConst";
import type { DatePickerConfig } from "@daygo/core";

export const useDatePicker = (config: DatePickerConfig) => {
	const dp = useConst(() => createDatePicker(config));

	useSyncExternalStore(dp.subscribe, dp.getSnapshot, dp.getSnapshot);

	return dp;
};
