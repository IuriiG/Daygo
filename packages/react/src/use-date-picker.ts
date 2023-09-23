import { createDatePicker } from "@daygo/core";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { useConst } from "./use-const";
import type { ControlledDatePickerConfig, DatePickerConfig, IDatePicker, UncontrolledDatePickerConfig } from "@daygo/core";

export function useDatePicker (config: ControlledDatePickerConfig): IDatePicker;
export function useDatePicker (config?: UncontrolledDatePickerConfig): IDatePicker
export function useDatePicker (config?: DatePickerConfig): IDatePicker {
	const dp = useConst(() => createDatePicker(config));

	useSyncExternalStore(dp.subscribe, dp.getSnapshot, dp.getSnapshot);

	return dp;
};
