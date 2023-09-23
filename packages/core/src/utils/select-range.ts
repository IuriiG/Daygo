import { getRange } from "../tools";
import { isSame } from "./date";
import { rangeOf } from "./helpers";
import { type IStore, replace } from "./store";

export function createRangeSelector() {
	let isActive = false;
	let rangeStart: Date | null = null;

	const updateSelector = (store: IStore, date: Date) => {
		const [current] = store.getState();

		if (!isActive || !current || !rangeStart) return;

		const next = rangeOf(rangeStart, date);

		if (isSame(current.from, next.from) && isSame(current.to, next.to)) return;

		replace(store, next);
	};

	const activateSelector = (store: IStore, date: Date) => {
		isActive = !isActive;
		if (!isActive) return;

		rangeStart = date;
		replace(store, getRange(date));
	};

	return {
		updateSelector,
		activateSelector
	};
}
