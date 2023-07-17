import { isSame } from "./date";
import { IEventStore, EventTypes, createEvent } from "./event-store";

export const createEmptyRange = () => createEvent(EventTypes.ADD);

export const createRangeSelector = () => {
    let isActive = false;
    let rangeEvent = createEmptyRange();

    const updateSelectorBegin = (_: IEventStore, date: Date | null) => {
        const {from, to}  = rangeEvent.value();
        if (isSame(from, date)) return;
        rangeEvent.value({from: date || to, to})
    }

    const updateSelectorEnd = (_: IEventStore, date: Date | null) => {
        const {from, to}  = rangeEvent.value();
        if (isSame(to, date)) return;
        rangeEvent.value({from, to: date || from})
    }

    const updateSelectorFull = (_: IEventStore, from: Date, to: Date) => {
        const {from: prevFrom, to: prevTo}  = rangeEvent.value();
        if (isSame(prevFrom, from) && isSame(prevTo, to)) return;
        rangeEvent.value({from, to});
    }

    const resetSelector = (store: IEventStore) => {
        store.remove(rangeEvent);
        rangeEvent = createEmptyRange();

        store.publish(rangeEvent);
    }

    const updateSelector = (_: IEventStore, date: Date) => {
        if (!isActive) return;

        const {from = null, to = null}  = rangeEvent.value();

        if (isSame(to, date)) return
        rangeEvent.value({from: from || date, to: date});
    };

    const activateSelector = (store: IEventStore, date: Date) => {
        isActive = !isActive;

        if (isActive) {
            resetSelector(store);
            rangeEvent.value({from: date, to: date})
        }

        updateSelector(store, date);
    };

    return {
        updateSelector,
        updateSelectorBegin,
        updateSelectorEnd,
        updateSelectorFull,
        activateSelector,
        resetSelector
    };
}