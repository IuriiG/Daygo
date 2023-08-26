import { dayNumber, isSameMonth, isToday, toISO, isWeekendCheck } from "../utils";
export interface IDay {
    readonly date: Date;
    readonly iso: string;
    readonly isToday: boolean;
    readonly isWeekend: boolean;
    readonly isDisabled: boolean;
    readonly isSelected: boolean;
    readonly isCurrentMonth: boolean;
}

export type DayObservable = keyof Pick<IDay, 'isSelected' | 'isDisabled'>;
export type DayUpdate = Record<DayObservable, boolean>;

export const createDay = (date: Date, focusedDate: Date, init: DayUpdate): IDay => {
    const {isSelected, isDisabled} = init;

    return {
        date,
        iso: toISO(date),
        isToday: isToday(date),
        isWeekend: isWeekendCheck(dayNumber(date)),
        isCurrentMonth: isSameMonth(date, focusedDate),
        isDisabled,
        isSelected
    };
}

export function updateDay(day: IDay, notify: () => void, update: DayUpdate) {
    Object
        .entries(update)
        .forEach(([key, value]) => {
            day[key as DayObservable] !== value && notify()
        });
}