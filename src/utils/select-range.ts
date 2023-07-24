import { isSame } from "./date";
import { IEventStore, EventTypes, createEvent } from "./event-store";

export const createEmptyRange = () => createEvent(EventTypes.ADD);

export const createRangeSelector = () => {
    let isActive = false;
    let rangeEvent = createEmptyRange();

    const updateSelector = (_: IEventStore, date: Date) => {
        if (!isActive) return;

        const {from = null, to = null}  = rangeEvent.value();

        if (isSame(to, date)) return
        rangeEvent.value({from: from || date, to: date});
    };

    const activateSelector = (store: IEventStore, date: Date) => {
        isActive = !isActive;

        if (isActive) {
            store.remove(rangeEvent);
            rangeEvent = createEmptyRange();

            store.publish(rangeEvent);
            rangeEvent.value({from: date, to: date})
        }

        updateSelector(store, date);
    };

    return {
        updateSelector,
        activateSelector
    };
}