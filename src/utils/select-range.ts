import { isSame } from "./date";
import { IStore, DateRange } from "./event-store";

export const createRangeSelector = () => {
    let isActive = false;
    let rangeEvent: DateRange | null = null;

    const updateSelector = (store: IStore, date: Date) => {
        if (!isActive || !rangeEvent) return;

        const {from = null, to = null}  = rangeEvent;

        if (isSame(to, date)) return

        store.remove(rangeEvent);
        rangeEvent = {from: from || date, to: date};
        store.publish(rangeEvent);
    };

    const activateSelector = (store: IStore, date: Date) => {
        isActive = !isActive;
        if (!isActive) return;

        rangeEvent && store.remove(rangeEvent);
        rangeEvent = { from: date, to: date }
        store.publish(rangeEvent);
    };

    return {
        updateSelector,
        activateSelector
    };
}