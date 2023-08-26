import { getRange } from "../tools";
import { isSame } from "./date";
import type { DateRange, IStore } from "./store";

export function createRangeSelector() {
	let isActive = false;
	let rangeEvent: DateRange | null = null;

	const updateSelector = (store: IStore, date: Date) => {
		if (!isActive || !rangeEvent) return;

		const { from = null, to = null }  = rangeEvent;

		if (isSame(to, date)) return;

		store.remove(rangeEvent);
		rangeEvent = { from: from || date, to: date };
		store.publish(rangeEvent);
	};

	const activateSelector = (store: IStore, date: Date) => {
		isActive = !isActive;
		if (!isActive) return;

		rangeEvent && store.remove(rangeEvent);
		rangeEvent = getRange(date);
		store.publish(rangeEvent);
	};

	return {
		updateSelector,
		activateSelector
	};
}
