import { suite } from 'uvu';
import * as assert from 'uvu/assert';
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
    toDateString,
    subtractYear,
    subtractMonth,
    fromDateString,
    setFirstDayOfMonth,
} from '../utils/date';

const date = suite('date');

date('parse', () => {
    const date1 = new Date();
    const iso = date1.toISOString();

    const stringDate = '2023-05-05';
    const date2 = new Date(stringDate);

    assert.equal(parse(iso), date1);
    assert.equal(parse(stringDate), date2);
});

date('toISO', () => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    assert.type(toISO(date), 'string');
    assert.ok(toISO(date) === date.toISOString())
});

date('today', () => {
    const today1 = today();
    const today2 = new Date();
    assert.ok(today1.toDateString() === today2.toDateString())
});

date('isSame', () => {
    assert.ok(isSame(new Date(), new Date()));
    assert.ok(isSame(null, null));
    assert.not(isSame(new Date(), new Date('2023-01-01')));
    assert.not(isSame(new Date('2023-01-01'), new Date()));
    assert.not(isSame(new Date(), null));
    assert.not(isSame(null, new Date()));
});

date('toDate', () => {
    assert.ok(toDate(new Date()) instanceof Date);
    assert.ok(toDate('2023-03-05') instanceof Date);
});

date('addDay', () => {
    const date1 = new Date();
    date1.setDate(1);
    const dayNum1 = date1.getDate();
    const date2 = addDay(date1);
    const dayNum2 = date2.getDate();
    const date3 = addDay(date1, 5);
    const dayNum3 = date3.getDate();

    assert.is(dayNum2, dayNum1 + 1);
    assert.is(dayNum3, dayNum1 + 5);
});

date('setDay', () => {
    const date = new Date('2023-02-28');

    assert.is(setDay(date, 5).getDate(), 5);
    assert.is(setDay(date, 15).getDate(), 15);
    assert.is(setDay(date, 35).getDate(), 28);
    assert.is(setDay(date, -35).getDate(), 28);
});

date('isToday', () => {
    assert.ok(isToday(new Date()));
    assert.not(isToday(new Date('2023-01-01')));
});

date('isAfter', () => {
    assert.ok(isAfter(new Date(), new Date('2023-01-01')));
    assert.not(isAfter(new Date('2023-01-01'), new Date()));
    assert.not(isAfter(new Date(), new Date()));
});

date('getDate', () => {
    const date1 = new Date();
    const date2 = getDate();
    const date3 = getDate(date1);

    assert.ok(date1.toDateString() === date2.toDateString());
    assert.ok(date1.toDateString() === date3.toDateString());
    assert.is(date2.getUTCHours(), 0);
    assert.is(date2.getUTCMinutes(), 0);
    assert.is(date2.getUTCSeconds(), 0);
    assert.is(date2.getUTCMilliseconds(), 0);
    assert.is(date3.getUTCHours(), 0);
    assert.is(date3.getUTCMinutes(), 0);
    assert.is(date3.getUTCSeconds(), 0);
    assert.is(date3.getUTCMilliseconds(), 0);
});

date('addYear', () => {
    const currentYear = new Date().getFullYear();
    assert.is(addYear(new Date()).getFullYear(), currentYear + 1);
    assert.is(addYear(new Date(), 3).getFullYear(), currentYear + 3);
});

date('setYear', () => {
    const currentYear = new Date().getFullYear();
    assert.is(setYear(new Date(), currentYear - 3).getFullYear(), currentYear - 3);
    assert.is(setYear(new Date(), currentYear + 3).getFullYear(), currentYear + 3);
    assert.is(setYear(new Date(), new Date(`${currentYear - 3}`)).getFullYear(), currentYear - 3);
    assert.is(setYear(new Date(), new Date(`${currentYear + 3}`)).getFullYear(), currentYear + 3);
});

date('isBefore', () => {
    assert.ok(isBefore(new Date('2023-01-01'), new Date()));
    assert.not(isBefore(new Date(), new Date('2023-01-01')));
    assert.not(isBefore(new Date(), new Date()));
});

date('setMonth', () => {
    assert.is(setMonth(new Date('2023-01-15'), 5).getMonth(), 5);
    assert.is(setMonth(new Date('2023-01-15'), 9).getMonth(), 9);
    assert.is(setMonth(new Date('2023-01-15'), 15).getMonth(), 3);
    assert.is(setMonth(new Date('2023-01-15'), new Date('2023-05-07')).getMonth(), 4);
    assert.is(setMonth(new Date('2023-01-15'), new Date('2023-09-07')).getMonth(), 8);
    assert.is(setMonth(new Date('2023-01-15'), new Date('2024-12-07')).getMonth(), 11);
});

date('addMonth', () => {
    const currentMonth = new Date().getMonth();
    const createNextMonth = (month: number, offset: number) => {
        const res = month + offset;
        return res > 11 ? res - 12 : res;
    }

    const offset1 = 1;
    const offset2 = 5;
    const offset3 = 11;

    assert.is(addMonth(new Date()).getMonth(), createNextMonth(currentMonth, offset1));
    assert.is(addMonth(new Date(), offset2).getMonth(), createNextMonth(currentMonth, offset2));
    assert.is(addMonth(new Date(), offset3).getMonth(), createNextMonth(currentMonth, offset3));
});

date('dayNumber', () => {
    assert.is(dayNumber(new Date('2023-01-16')), 1);
    assert.is(dayNumber(new Date('2023-01-17')), 2);
    assert.is(dayNumber(new Date('2023-01-18')), 3);
    assert.is(dayNumber(new Date('2023-01-19')), 4);
    assert.is(dayNumber(new Date('2023-01-20')), 5);
    assert.is(dayNumber(new Date('2023-01-21')), 6);
    assert.is(dayNumber(new Date('2023-01-22')), 7);
});

date('isSameMonth', () => {
    assert.ok(isSameMonth(new Date(), new Date()));
    assert.ok(isSameMonth(new Date('2023-01-15'), new Date('2023-01-18')));
    assert.not(isSameMonth(new Date('2022-01-15'), new Date('2023-01-22')));
    assert.not(isSameMonth(new Date('2023-01-01'), new Date('2023-02-01')));
    assert.not(isSameMonth(new Date(NaN), new Date('2023-02-01')));
    assert.not(isSameMonth(new Date('2023-02-01'), new Date(NaN)));
    assert.not(isSameMonth(new Date(NaN), new Date(NaN)));
});

date('daysInMonth', () => {
    assert.is(daysInMonth(new Date('2023-01-10')), 31);
    assert.is(daysInMonth(new Date('2023-02-15')), 28);
    assert.is(daysInMonth(new Date('2023-03-12')), 31);
    assert.is(daysInMonth(new Date('2023-04-14')), 30);
    assert.is(daysInMonth(new Date('2023-05-17')), 31);
    assert.is(daysInMonth(new Date('2023-06-23')), 30);
    assert.is(daysInMonth(new Date('2023-07-18')), 31);
    assert.is(daysInMonth(new Date('2023-08-11')), 31);
    assert.is(daysInMonth(new Date('2023-09-22')), 30);
    assert.is(daysInMonth(new Date('2023-10-25')), 31);
    assert.is(daysInMonth(new Date('2023-11-05')), 30);
    assert.is(daysInMonth(new Date('2023-12-01')), 31);
});

date('subtractDay', () => {
    const date1 = new Date();
    date1.setDate(10);
    const dayNum1 = date1.getDate();
    const date2 = subtractDay(date1);
    const dayNum2 = date2.getDate();
    const date3 = subtractDay(date1, 5);
    const dayNum3 = date3.getDate();

    assert.is(dayNum2, dayNum1 - 1);
    assert.is(dayNum3, dayNum1 - 5);

    const date4 = new Date('2023-03-01');
    const date5 = subtractDay(date4);

    assert.is(date5.getMonth(), 1);
    assert.is(date5.getDate(), 28);
});

date('toDateString', () => {
    assert.type(toDateString(), 'string');
    assert.type(toDateString('2023-05-05'), 'string');
    assert.type(toDateString(new Date()), 'string');
    assert.type(toDateString({from: '2023-05-05'}), 'string');
    assert.type(toDateString({from: new Date()}), 'string');
    assert.type(toDateString({to: '2023-05-05'}), 'string');
    assert.type(toDateString({to: new Date()}), 'string');
    assert.type(toDateString({from: '2023-05-05', to: '2023-06-05'}), 'string');
    assert.type(toDateString({from: new Date(), to: '2023-05-05'}), 'string');
    assert.type(toDateString({from: new Date(), to: new Date()}), 'string');
});

date('subtractYear', () => {
    const date = new Date('2023');

    assert.is(subtractYear(date).getFullYear(), 2022);
    assert.is(subtractYear(date, 5).getFullYear(), 2018);
});

date('subtractMonth', () => {
    const date = new Date('2023-02');

    assert.is(subtractMonth(date).getMonth(), 0);
    assert.is(subtractMonth(date, 3).getMonth(), 10);
    assert.is(subtractMonth(date, 3).getFullYear(), 2022);
});

date('fromDateString', () => {
    const date1 = new Date('2023-05-05');
    const date2 = new Date('2023-06-06');
    const stringDate1 = date1.toISOString() + ':::' + date2.toISOString();
    const stringDate2 = date1.toISOString() + ':::';
    const stringDate3 = ':::' + date2.toISOString();
    assert.equal(fromDateString(stringDate1), {from: date1, to: date2});
    assert.equal(fromDateString(stringDate2), {from: date1, to: undefined});
    assert.equal(fromDateString(stringDate3), {from: undefined, to: date2});
});

date('setFirstDayOfMonth', () => {
    assert.is(setFirstDayOfMonth(new Date('2023-01-18')).getDate(), 1);
    assert.is(setFirstDayOfMonth(new Date('2023-05-21')).getDate(), 1);
    assert.is(setFirstDayOfMonth(new Date('2023-11-15')).getDate(), 1);
});

date.run();