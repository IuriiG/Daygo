import { setYear, toDate, today, setMonth, addYear, subtractYear, addMonth, subtractMonth } from "../utils/date";
import { IBus } from "../utils/command-bus";
import { ControllerCommand, CustomParser } from "../types/type";
import { Action, Simplify, ToCamelCase } from "../types/type-utils";
import { castDate, isNumber, toCamelCase } from "../utils/common";

const toDateWrapper = (toDateFn: typeof toDate) => {
    return (_: Date, date: Parameters<typeof toDate>[0]) => toDateFn(date);
}

// maybe to add a different wrapper to each 
export const focusCommandHandlers = {
    FOCUS_TODAY: today,
    FOCUS_YEAR: setYear,
    FOCUS_MONTH: setMonth,
    FOCUS_NEXT_YEAR: addYear,
    FOCUS_NEXT_MONTH: addMonth,
    FOCUS_PREW_YEAR: subtractYear,
    FOCUS_PREV_MONTH: subtractMonth,
    FOCUS_DATE: toDateWrapper(toDate),
}

export type FocusHandlersMap = typeof focusCommandHandlers;
export type FocusCommand = keyof FocusHandlersMap;
export type FocusHandler<T extends FocusCommand> = FocusHandlersMap[T];

export type FocusController = {
    [P in keyof FocusHandlersMap as ToCamelCase<P>]: Simplify<Action<FocusHandlersMap[P]>>
}

export const createFocusAction = (bus: IBus<ControllerCommand>, customParser?: CustomParser) => {
    return <T extends FocusCommand>(type: T): Simplify<Action<FocusHandlersMap[T]>> => {
        return (payload?: unknown) => {
            if (!payload || isNumber(payload)) {
                bus.send({type, payload});
                return;
            }

            bus.send({type, payload: castDate(payload, customParser)})
        }
    }
}

export const createFocusController = (bus: IBus<ControllerCommand>, customParser?: CustomParser) => {
    const bindCommand = createFocusAction(bus, customParser);

    return (Object.keys(focusCommandHandlers) as FocusCommand[]).reduce((acc, c) => {
        acc[toCamelCase(c)] = bindCommand(c);
        return acc;
    }, {} as FocusController);
}
