import { dayNumber, toDate, toISO, today } from "../utils/date";
import { isWeekendCheck } from "../utils/helpers";
import { createDay, updateDay } from "./day";

describe('Core: day', () => {
    it ('createDay', () => {
        const date1 = toDate('2023-01-01');
        const currentDay = today();

        const day1 = createDay(date1, currentDay, { isSelected: false, isDisabled: false });

        expect(day1.date).toEqual(date1);
        expect(day1.iso).toBe(toISO(date1));
        expect(day1.isWeekend).toBe(isWeekendCheck(dayNumber(day1.date)));
        expect(day1.isDisabled).toBe(false);
        expect(day1.isSelected).toBe(false);
        expect(day1.isToday).toBe(false);
        expect(day1.isCurrentMonth).toBe(false);

        const day2 = createDay(currentDay, currentDay, { isSelected: true, isDisabled: true });

        expect(day2.date).toEqual(currentDay);
        expect(day2.iso).toBe(toISO(currentDay));
        expect(day2.isDisabled).toBe(true);
        expect(day2.isSelected).toBe(true);
        expect(day2.isToday).toBe(true);
        expect(day2.isCurrentMonth).toBe(true);
    });

    it ('updateDay', () => {
        const date1 = toDate('2023-01-01');
        const currentDay = today();

        const day1 = createDay(date1, currentDay, { isSelected: false, isDisabled: false });
        const notify1 = vi.fn();
        const notify2 = vi.fn();
        const notify3 = vi.fn();

        updateDay(day1, notify1, { isSelected: true, isDisabled: false });

        expect(notify1).toHaveBeenCalledTimes(1);

        updateDay(day1, notify2, { isSelected: false, isDisabled: true });

        expect(notify2).toHaveBeenCalledTimes(1);

        updateDay(day1, notify3, { isSelected: true, isDisabled: true });

        expect(notify3).toHaveBeenCalledTimes(2);
    });
});
