import { setFirstDayOfMonth, toDate, today } from "../utils/date";
import { WeekStarts } from "../utils/helpers";
import { flushPromises } from "../utils/test-utils";
import { createController } from "./controller";
import { createDatePicker, generateMonth } from "./date-picker";

describe('Core: date-picker', () => {
    const is = () => false;

    const isSelected = vi.fn(is);
    const isDisabled = vi.fn(is);

    const fixedStates = [
        {
            date: toDate('2023-01-01'),
            startDate: toDate('2022-12-25'),
            finishDate: toDate('2023-02-04')
        },
        {
            date: toDate('2023-02-01'),
            startDate: toDate('2023-01-29'),
            finishDate: toDate('2023-03-11')
        },
        {
            date: toDate('2023-03-01'),
            startDate: toDate('2023-02-26'),
            finishDate: toDate('2023-04-08')
        },
        {
            date: toDate('2023-04-01'),
            startDate: toDate('2023-03-26'),
            finishDate: toDate('2023-05-06')
        },
        {
            date: toDate('2023-05-01'),
            startDate: toDate('2023-04-30'),
            finishDate: toDate('2023-06-10')
        },
        {
            date: toDate('2023-06-01'),
            startDate: toDate('2023-05-28'),
            finishDate: toDate('2023-07-08')
        },
        {
            date: toDate('2023-07-01'),
            startDate: toDate('2023-06-25'),
            finishDate: toDate('2023-08-05')
        },
        {
            date: toDate('2023-08-01'),
            startDate: toDate('2023-07-30'),
            finishDate: toDate('2023-09-09')
        },
        {
            date: toDate('2023-09-01'),
            startDate: toDate('2023-08-27'),
            finishDate: toDate('2023-10-07')
        },
        {
            date: toDate('2023-10-01'),
            startDate: toDate('2023-09-24'),
            finishDate: toDate('2023-11-04')
        },
        {
            date: toDate('2023-11-01'),
            startDate: toDate('2023-10-29'),
            finishDate: toDate('2023-12-09')
        },
        {
            date: toDate('2023-12-01'),
            startDate: toDate('2023-11-26'),
            finishDate: toDate('2024-01-06')
        },
    ];

    beforeEach(() => {
        isSelected.mockClear();
        isDisabled.mockClear();
    });

    it ('generateMonth: weekStartsOn = 0, fixed', () => {
        const isFixed = true;
        const fixedLength = 42;
        const weekStartsOn: WeekStarts = 0;
        
        fixedStates.forEach(({ date, startDate, finishDate}, i) => {
            const monthGrid = generateMonth(date, isFixed, weekStartsOn, isSelected, isDisabled);
            const count = fixedLength * (i + 1);

            const firstDay = monthGrid[0];
            const lastDay = monthGrid[monthGrid.length - 1];

            expect(monthGrid.length).toBe(fixedLength);

            expect(firstDay.date).toEqual(startDate);
            expect(firstDay.isDisabled).toBe(false);
            expect(firstDay.isSelected).toBe(false);
            expect(firstDay.isCurrentMonth).toBe(false);

            expect(lastDay.date).toEqual(finishDate);
            expect(lastDay.isDisabled).toBe(false);
            expect(lastDay.isSelected).toBe(false);
            expect(lastDay.isCurrentMonth).toBe(false);

            expect(isSelected).toHaveBeenCalledTimes(count);
            expect(isDisabled).toHaveBeenCalledTimes(count);

            expect(isSelected).toHaveBeenCalledWith(startDate);
            expect(isDisabled).toHaveBeenCalledWith(startDate);
            expect(isSelected).toHaveBeenCalledWith(date);
            expect(isDisabled).toHaveBeenCalledWith(date);
            expect(isSelected).toHaveBeenCalledWith(finishDate);
            expect(isDisabled).toHaveBeenCalledWith(finishDate);
        });
    });

    it ('generateMonth: weekStartsOn = 1, not fixed', () => {
        const isFixed = false;
        const weekStartsOn: WeekStarts = 1;

        const notFixedStates = [
            {
                date: toDate('2023-01-01'),
                startDate: toDate('2022-12-26'),
                finishDate: toDate('2023-02-05')
            },
            {
                date: toDate('2023-02-01'),
                startDate: toDate('2023-01-30'),
                finishDate: toDate('2023-03-05')
            },
            {
                date: toDate('2023-03-01'),
                startDate: toDate('2023-02-27'),
                finishDate: toDate('2023-04-02')
            },
            {
                date: toDate('2023-04-01'),
                startDate: toDate('2023-03-27'),
                finishDate: toDate('2023-04-30')
            },
            {
                date: toDate('2023-05-01'),
                startDate: toDate('2023-04-24'),
                finishDate: toDate('2023-06-04')
            },
            {
                date: toDate('2023-06-01'),
                startDate: toDate('2023-05-29'),
                finishDate: toDate('2023-07-02')
            },
            {
                date: toDate('2023-07-01'),
                startDate: toDate('2023-06-26'),
                finishDate: toDate('2023-08-06')
            },
            {
                date: toDate('2023-08-01'),
                startDate: toDate('2023-07-31'),
                finishDate: toDate('2023-09-03')
            },
            {
                date: toDate('2023-09-01'),
                startDate: toDate('2023-08-28'),
                finishDate: toDate('2023-10-01')
            },
            {
                date: toDate('2023-10-01'),
                startDate: toDate('2023-09-25'),
                finishDate: toDate('2023-11-05')
            },
            {
                date: toDate('2023-11-01'),
                startDate: toDate('2023-10-30'),
                finishDate: toDate('2023-12-03')
            },
            {
                date: toDate('2023-12-01'),
                startDate: toDate('2023-11-27'),
                finishDate: toDate('2023-12-31')
            },
        ];
        
        let count = 0;
        notFixedStates.forEach(({ date, startDate, finishDate}) => {
            const monthGrid = generateMonth(date, isFixed, weekStartsOn, isSelected, isDisabled);
            count += monthGrid.length;

            const firstDay = monthGrid[0];
            const lastDay = monthGrid[monthGrid.length - 1];

            expect(firstDay.date).toEqual(startDate);
            expect(firstDay.isDisabled).toBe(false);
            expect(firstDay.isSelected).toBe(false);
            expect(firstDay.isCurrentMonth).toBe(false);

            expect(lastDay.date).toEqual(finishDate);
            expect(lastDay.isDisabled).toBe(false);
            expect(lastDay.isSelected).toBe(false);

            expect(isSelected).toHaveBeenCalledTimes(count);
            expect(isDisabled).toHaveBeenCalledTimes(count);

            expect(isSelected).toHaveBeenCalledWith(startDate);
            expect(isDisabled).toHaveBeenCalledWith(startDate);
            expect(isSelected).toHaveBeenCalledWith(date);
            expect(isDisabled).toHaveBeenCalledWith(date);
            expect(isSelected).toHaveBeenCalledWith(finishDate);
            expect(isDisabled).toHaveBeenCalledWith(finishDate);
        });
    });

    it ('createDatePicker', async () => {
        const datePicker = createDatePicker({
            defaultMonth: '2023-01-01',
            weekStartsOn: 0,
            isFixed: true
        });

        const subscriber = vi.fn();
        const focusSubscriber = vi.fn();
        const selectSubscriber = vi.fn();
        const disableSubscriber = vi.fn();

        datePicker.subscribe(subscriber);
        datePicker.controller.onFocusChange(focusSubscriber);
        datePicker.controller.onSelectChange(selectSubscriber);
        datePicker.controller.onDisableChange(disableSubscriber);

        expect(datePicker).toBeDefined();
        expect(datePicker.getSnapshot()).toBe(0);
        expect(subscriber).toHaveBeenCalledTimes(0);

        datePicker.controller.focusNextMonth();

        await flushPromises();

        expect(datePicker.getSnapshot()).toBe(1);

        const monthGrid1 = datePicker.month;

        const firstDay1 = monthGrid1[0];
        const lastDay1 = monthGrid1[monthGrid1.length - 1];

        expect(firstDay1.date).toEqual(fixedStates[1].startDate);
        expect(lastDay1.date).toEqual(fixedStates[1].finishDate);
        expect(datePicker.focusedDate).toEqual(fixedStates[1].date);

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(focusSubscriber).toHaveBeenCalledTimes(1);
        expect(selectSubscriber).toHaveBeenCalledTimes(0);
        expect(disableSubscriber).toHaveBeenCalledTimes(0);

        datePicker.controller.focusNextMonth();
        datePicker.controller.focusNextMonth();

        await flushPromises();

        expect(datePicker.getSnapshot()).toBe(2);

        const monthGrid2 = datePicker.month;

        const firstDay2 = monthGrid2[0];
        const lastDay2 = monthGrid2[monthGrid2.length - 1];

        expect(firstDay2.date).toEqual(fixedStates[3].startDate);
        expect(lastDay2.date).toEqual(fixedStates[3].finishDate);
        expect(datePicker.focusedDate).toEqual(fixedStates[3].date);

        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(focusSubscriber).toHaveBeenCalledTimes(2);
        expect(selectSubscriber).toHaveBeenCalledTimes(0);
        expect(disableSubscriber).toHaveBeenCalledTimes(0);

        datePicker.controller.selectDateMultiple(fixedStates[3].date);

        await flushPromises();

        expect(datePicker.getSnapshot()).toBe(3);

        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(focusSubscriber).toHaveBeenCalledTimes(2);
        expect(selectSubscriber).toHaveBeenCalledTimes(1);
        expect(disableSubscriber).toHaveBeenCalledTimes(0);

        datePicker.controller.selectDateMultiple(fixedStates[4].date);
        datePicker.controller.selectDateMultiple(fixedStates[5].date);

        await flushPromises();

        expect(datePicker.getSnapshot()).toBe(3);

        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(focusSubscriber).toHaveBeenCalledTimes(2);
        expect(selectSubscriber).toHaveBeenCalledTimes(2);
        expect(disableSubscriber).toHaveBeenCalledTimes(0);

        datePicker.controller.disableDate(fixedStates[6].date);

        await flushPromises();

        expect(datePicker.getSnapshot()).toBe(3);

        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(focusSubscriber).toHaveBeenCalledTimes(2);
        expect(selectSubscriber).toHaveBeenCalledTimes(2);
        expect(disableSubscriber).toHaveBeenCalledTimes(1);

        datePicker.controller.disableDate(fixedStates[7].date);
        datePicker.controller.disableDate(fixedStates[8].date);

        await flushPromises();

        expect(datePicker.getSnapshot()).toBe(3);

        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(focusSubscriber).toHaveBeenCalledTimes(2);
        expect(selectSubscriber).toHaveBeenCalledTimes(2);
        expect(disableSubscriber).toHaveBeenCalledTimes(2);

        datePicker.controller.focusToday();

        await flushPromises();

        expect(datePicker.getSnapshot()).toBe(4);

        expect(subscriber).toHaveBeenCalledTimes(4);
        expect(focusSubscriber).toHaveBeenCalledTimes(3);
        expect(selectSubscriber).toHaveBeenCalledTimes(2);
        expect(disableSubscriber).toHaveBeenCalledTimes(2);

        await flushPromises();

        datePicker.controller.focusToday();

        expect(datePicker.getSnapshot()).toBe(4);

        expect(subscriber).toHaveBeenCalledTimes(4);
        expect(focusSubscriber).toHaveBeenCalledTimes(3);
        expect(selectSubscriber).toHaveBeenCalledTimes(2);
        expect(disableSubscriber).toHaveBeenCalledTimes(2);
    });

    it('datePicker: subscribe', async () => {
        const controller = createController();
        const datePicker = createDatePicker({
            defaultMonth: '2023-01-01',
            weekStartsOn: 0,
            isFixed: true,
            controller
        });

        const subscriber = vi.fn();

        const dispose = datePicker.subscribe(subscriber);

        expect(subscriber).toHaveBeenCalledTimes(0);
        expect(dispose).toBeDefined();

        controller.focusNextMonth();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(1);

        controller.focusNextMonth();
        controller.focusNextMonth();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);

        dispose();

        controller.focusNextMonth();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it ('datePicker: useController', async () => {
        const externalController = createController();
        const datePicker = createDatePicker({
            defaultMonth: '2023-01-01',
            weekStartsOn: 0,
            isFixed: true
        });

        const subscriber = vi.fn();

        const dispose = datePicker.subscribe(subscriber);

        expect(subscriber).toHaveBeenCalledTimes(0);
        expect(dispose).toBeDefined();

        datePicker.controller.focusNextMonth();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(1);

        externalController.focusNextMonth();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(1);

        const prevController = datePicker.controller;

        datePicker.useController(externalController);
        prevController.focusNextMonth();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);

        expect(datePicker.controller === externalController).toBe(true);

        externalController.focusNextMonth();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(3);
    });

    it ('datePicker: defaultMonth', async () => {
        const datePicker1 = createDatePicker({
            defaultMonth: '2023-01-01',
        });

        expect(datePicker1.focusedDate).toEqual(setFirstDayOfMonth(toDate('2023-01-01')));

        const datePicker2 = createDatePicker();

        expect(datePicker2.focusedDate).toEqual(setFirstDayOfMonth(today()));
    });

    it ('datePicker: customParser', async () => {
        const customParser = vi.fn((date: string) => new Date(date));
        const controller = createController({customParser});
        const datePicker = createDatePicker({
            controller
        });

        expect(datePicker.controller.getConfig()?.customParser).toBe(customParser);
    });
});
