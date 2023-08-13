import {
    parse,
    toISO,
    today,
    isSame,
    toDate,
    addDay,
    setDay,
    isToday,
    isAfter,
    getDate,
    addYear,
    setYear,
    isBefore,
    setMonth,
    addMonth, 
    dayNumber, 
    isSameMonth,
    daysInMonth,
    subtractDay,
    subtractYear,
    subtractMonth,
    setFirstDayOfMonth,
} from '../utils/date';

describe('Utils: date', () => {
    it('parse', () => {
        const date1 = new Date();
        const iso = date1.toISOString();

        const stringDate = '2023-05-05';
        const date2 = new Date(stringDate);

        expect(parse(iso)).toEqual(date1);
        expect(parse(stringDate)).toEqual(date2);
    });

    it('toISO', () => {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);

        expect(typeof toISO(date)).toBe('string');
        expect(toISO(date) === date.toISOString()).toBe(true);
    });

    it('today', () => {
        const today1 = today();
        const today2 = new Date();
        expect(today1.toDateString() === today2.toDateString()).toBe(true);
    });

    it('isSame', () => {
        expect(isSame(new Date(), new Date())).toBe(true);
        expect(isSame(null, null)).toBe(true);
        expect(isSame(new Date('2023-01-01'), new Date('2023-01-01'))).toBe(true);

        expect(isSame(new Date(), new Date('2023-01-01'))).toBe(false);
        expect(isSame(new Date('2023-01-01'), new Date())).toBe(false);
        expect(isSame(new Date(), null)).toBe(false);
        expect(isSame(null, new Date())).toBe(false);
    });

    it('toDate', () => {
        expect(toDate(new Date())).toBeInstanceOf(Date);
        expect(toDate('2023-03-05')).toBeInstanceOf(Date);
    });

    it('addDay', () => {
        const date1 = new Date();
        date1.setDate(1);
        const dayNum1 = date1.getDate();
        const date2 = addDay(date1);
        const dayNum2 = date2.getDate();
        const date3 = addDay(date1, 5);
        const dayNum3 = date3.getDate();

        expect(dayNum2).toBe(dayNum1 + 1);
        expect(dayNum3).toBe(dayNum1 + 5);
    });

    it('setDay', () => {
        const date = new Date('2023-02-28');
        const nextDate = new Date('2023-03-01');

        expect(setDay(date, 5).getDate()).toBe(5);
        expect(setDay(date, 15).getDate()).toBe(15);
        expect(setDay(date, 35).getDate()).toBe(28);
        expect(setDay(date, -35).getDate()).toBe(28);
        expect(setDay(date, nextDate).getDate()).toBe(1);
    });

    it('isToday', () => {
        expect(isToday(new Date())).toBe(true);
        expect(isToday(new Date('2023-01-01'))).toBe(false);
    });

    it('isAfter', () => {
        expect(isAfter(new Date(), new Date('2023-01-01'))).toBe(true);
        expect(isAfter(new Date('2023-01-01'), new Date())).toBe(false);
        expect(isAfter(new Date(), new Date())).toBe(false);
    });

    it('getDate', () => {
        const date1 = new Date();
        const date2 = getDate();
        const date3 = getDate(date1);

        expect(date1.toDateString() === date2.toDateString()).toBe(true);
        expect(date1.toDateString() === date3.toDateString()).toBe(true);
        expect(date2.getUTCHours()).toBe(0);
        expect(date2.getUTCMinutes()).toBe(0);
        expect(date2.getUTCSeconds()).toBe(0);
        expect(date2.getUTCMilliseconds()).toBe(0);
        expect(date3.getUTCHours()).toBe(0);
        expect(date3.getUTCMinutes()).toBe(0);
        expect(date3.getUTCSeconds()).toBe(0);
        expect(date3.getUTCMilliseconds()).toBe(0);
    });

    it('addYear', () => {
        const currentYear = new Date().getFullYear();
        expect(addYear(new Date()).getFullYear()).toBe(currentYear + 1);
        expect(addYear(new Date(), 3).getFullYear()).toBe(currentYear + 3);
    });

    it('setYear', () => {
        const currentYear = new Date().getFullYear();
        expect(setYear(new Date(), currentYear - 3).getFullYear()).toBe(currentYear - 3);
        expect(setYear(new Date(), currentYear + 3).getFullYear()).toBe(currentYear + 3);
        expect(setYear(new Date(), new Date(`${currentYear - 3}`)).getFullYear()).toBe(currentYear - 3);
        expect(setYear(new Date(), new Date(`${currentYear + 3}`)).getFullYear()).toBe(currentYear + 3);
    });

    it('isBefore', () => {
        expect(isBefore(new Date('2023-01-01'), new Date())).toBe(true);
        expect(isBefore(new Date(), new Date('2023-01-01'))).toBe(false);
        expect(isBefore(new Date(), new Date())).toBe(false);
    });

    it('setMonth', () => {
        expect(setMonth(new Date('2023-01-15'), 5).getMonth()).toBe(5);
        expect(setMonth(new Date('2023-01-15'), 9).getMonth()).toBe(9);
        expect(setMonth(new Date('2023-01-15'), 15).getMonth()).toBe(3);
        expect(setMonth(new Date('2023-01-15'), new Date('2023-05-07')).getMonth()).toBe(4);
        expect(setMonth(new Date('2023-01-15'), new Date('2023-09-07')).getMonth()).toBe(8);
        expect(setMonth(new Date('2023-01-15'), new Date('2024-12-07')).getMonth()).toBe(11);
    });

    it('addMonth', () => {
        const currentMonth = new Date().getMonth();
        const createNextMonth = (month: number, offset: number) => {
            const res = month + offset;
            return res > 11 ? res - 12 : res;
        }

        const offset1 = 1;
        const offset2 = 5;
        const offset3 = 11;

        expect(addMonth(new Date()).getMonth()).toBe(createNextMonth(currentMonth, offset1));
        expect(addMonth(new Date(), offset2).getMonth()).toBe(createNextMonth(currentMonth, offset2));
        expect(addMonth(new Date(), offset3).getMonth()).toBe(createNextMonth(currentMonth, offset3));
    });

    it('dayNumber', () => {
        expect(dayNumber(new Date('2023-01-16'))).toBe(1);
        expect(dayNumber(new Date('2023-01-17'))).toBe(2);
        expect(dayNumber(new Date('2023-01-18'))).toBe(3);
        expect(dayNumber(new Date('2023-01-19'))).toBe(4);
        expect(dayNumber(new Date('2023-01-20'))).toBe(5);
        expect(dayNumber(new Date('2023-01-21'))).toBe(6);
        expect(dayNumber(new Date('2023-01-22'))).toBe(0);
    });

    it('isSameMonth', () => {
        expect(isSameMonth(new Date(), new Date())).toBe(true);
        expect(isSameMonth(new Date('2023-01-15'), new Date('2023-01-18'))).toBe(true);
        expect(isSameMonth(new Date('2022-01-15'), new Date('2023-01-22'))).toBe(false);
        expect(isSameMonth(new Date('2023-01-01'), new Date('2023-02-01'))).toBe(false);
        expect(isSameMonth(new Date(NaN), new Date('2023-02-01'))).toBe(false);
        expect(isSameMonth(new Date('2023-02-01'), new Date(NaN))).toBe(false);
        expect(isSameMonth(new Date(NaN), new Date(NaN))).toBe(false);
    });

    it('daysInMonth', () => {
        expect(daysInMonth(new Date('2023-01-10'))).toBe(31);
        expect(daysInMonth(new Date('2023-02-15'))).toBe(28);
        expect(daysInMonth(new Date('2023-03-12'))).toBe(31);
        expect(daysInMonth(new Date('2023-04-14'))).toBe(30);
        expect(daysInMonth(new Date('2023-05-17'))).toBe(31);
        expect(daysInMonth(new Date('2023-06-23'))).toBe(30);
        expect(daysInMonth(new Date('2023-07-18'))).toBe(31);
        expect(daysInMonth(new Date('2023-08-11'))).toBe(31);
        expect(daysInMonth(new Date('2023-09-22'))).toBe(30);
        expect(daysInMonth(new Date('2023-10-25'))).toBe(31);
        expect(daysInMonth(new Date('2023-11-05'))).toBe(30);
        expect(daysInMonth(new Date('2023-12-01'))).toBe(31);
    });

    it('subtractDay', () => {
        const date1 = new Date();
        date1.setDate(10);
        const dayNum1 = date1.getDate();
        const date2 = subtractDay(date1);
        const dayNum2 = date2.getDate();
        const date3 = subtractDay(date1, 5);
        const dayNum3 = date3.getDate();

        expect(dayNum2).toBe(dayNum1 - 1);
        expect(dayNum3).toBe(dayNum1 - 5);

        const date4 = new Date('2023-03-01');
        const date5 = subtractDay(date4);

        expect(date5.getMonth()).toBe(1);
        expect(date5.getDate()).toBe(28);
    });

    it('subtractYear', () => {
        const date = new Date('2023');

        expect(subtractYear(date).getFullYear()).toBe(2022);
        expect(subtractYear(date, 5).getFullYear()).toBe(2018);
    });

    it('subtractMonth', () => {
        const date = new Date('2023-02');

        expect(subtractMonth(date).getMonth()).toBe(0);
        expect(subtractMonth(date, 3).getMonth()).toBe(10);
        expect(subtractMonth(date, 3).getFullYear()).toBe(2022);
    });

    it('setFirstDayOfMonth', () => {
        expect(setFirstDayOfMonth(new Date('2023-01-18')).getDate()).toBe(1);
        expect(setFirstDayOfMonth(new Date('2023-05-21')).getDate()).toBe(1);
        expect(setFirstDayOfMonth(new Date('2023-11-15')).getDate()).toBe(1);
    });
})