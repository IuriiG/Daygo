import { setYear, toDate, today, setMonth, addYear, subtractYear, addMonth, subtractMonth } from "../utils/date";
import { IBus } from "../utils/command-bus";
import { ControllerCommand } from "../types/type";
import { Action, Simplify, ToCamelCase } from "../types/type-utils";
import { castDate, toCamelCase } from "../utils/common";

const toDateWrapper = (toDateFn: typeof toDate) => {
    return (_: Date, date: Parameters<typeof toDate>[0]) => toDateFn(date);
}

// maybe to add a different wrapper to each 
export const focusCommandHandlers = {
    SHOW_TODAY: today,
    SHOW_YEAR: setYear,
    SHOW_MONTH: setMonth,
    SHOW_NEXT_YEAR: addYear,
    SHOW_NEXT_MONTH: addMonth,
    SHOW_PREW_YEAR: subtractYear,
    SHOW_PREV_MONTH: subtractMonth,
    SHOW_DATE: toDateWrapper(toDate),
}

export type FocusHandlersMap = typeof focusCommandHandlers;
export type FocusCommand = keyof FocusHandlersMap;
export type FocusHandler<T extends FocusCommand> = FocusHandlersMap[T];

export type FocusController = {
    [P in keyof FocusHandlersMap as ToCamelCase<P>]: Simplify<Action<FocusHandlersMap[P]>>
}

export const createFocusAction = (bus: IBus<ControllerCommand>, customParser?: (date: string) => Date) => {
    return <T extends FocusCommand>(type: T): Simplify<Action<FocusHandlersMap[T]>> => {
        return (payload?: unknown) => {
            payload = payload && castDate(payload, customParser);
            bus.send({type, payload})
        }
    }
}

export const createFocusController = (bus: IBus<ControllerCommand>, customParser?: (date: string) => Date) => {
    const action = createFocusAction(bus, customParser);

    return (Object.keys(focusCommandHandlers) as FocusCommand[]).reduce((acc, c) => {
        acc[toCamelCase(c)] = action(c);
        return acc;
    }, {} as FocusController);
}
