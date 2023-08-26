/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-shadow */
import {
    addDay,
    calculatePrevMonthLength,
    castDate,
    createEffect,
    createObservable,
    createShare,
    getMonthLength,
    isSame,
    setFirstDayOfMonth,
    subtractDay,
    today
} from "../utils";
import { createDay, updateDay } from "./day";
import { focusCommandHandlers } from "./controller-focus";
import { createController } from "./controller";
import type {
    Subscribe,
    WeekStarts } from "../utils";
import type { IDay } from "./day";
import type { FocusCommand } from "./controller-focus";
import type { Controller, ControllerConfig, ControllerWithBus } from "./controller";
import type { ControllerCommand, FocusControllerCommand } from "../types/type";

export type DatePickerConfig = Readonly<ControllerConfig & {
    isFixed?: boolean;
    controller?: Controller;
    weekStartsOn?: WeekStarts;
    defaultMonth?: Date | string;
}>

export interface IDatePicker {
    readonly month: IDay[];
    readonly focusedDate: Date;
    readonly subscribe: Subscribe;
    readonly controller: Controller;
    readonly getSnapshot: () => number;
    readonly useController: (controller: Controller) => void;
}

export const createDatePicker = (config?: DatePickerConfig): IDatePicker => {
    const {
        defaultMonth,
        controller: external,
        isFixed = false,
        weekStartsOn = 1,
        ...controllerConfig
    } = config || {};

    const customParser = config?.customParser
        || external?.getConfig()?.customParser;

    let version = 0;

    let monthGrid: IDay[] = [];
    let focusedDate = setFirstDayOfMonth(
        defaultMonth
            ? castDate(defaultMonth, customParser)
            : today()
        );

    let connectionDispose: () => void;
    let controller = external ?? createController(controllerConfig);

    const observable = createObservable();
    const share = createShare<ControllerCommand>();

    const scheduleRender = createEffect(() => {
        version++;
        monthGrid.length = 0;
        observable.notify();
    });

    const recalculate = createEffect(() => {
        monthGrid.forEach((day) => {
            const isDisabled = controller.isDisabled(day.date);
            const isSelected = !isDisabled && controller.isSelected(day.date);

            updateDay(day, scheduleRender, { isSelected, isDisabled });
        });
    });

    const connect = () => (controller as ControllerWithBus).$$bus.subscribe(share.next);

    const useController = (next: Controller) => {
        scheduleRender();
        connectionDispose();

        controller = next;
        connectionDispose = connect();
    };

    const commandHandler = (command: ControllerCommand) => {
        const handler = focusCommandHandlers[command.type as FocusCommand];

        if (handler) {
            const previousDate = focusedDate;
            const { payload } = command as FocusControllerCommand;

            focusedDate = setFirstDayOfMonth(handler(focusedDate, payload));

            if (isSame(previousDate, focusedDate)) {
                return;
            }

            scheduleRender();
            return;
        }

        recalculate();
    };

    const getSnapshot = () => version;

    const subscribe: Subscribe = (subscriber) => {
        const dispose = observable.subscribe(subscriber);
        const busDispose = share.subscribe(commandHandler);

        connectionDispose = connect();
        return () => {
            dispose();
            busDispose();
            connectionDispose();
        };
    };

    const dp = {
        subscribe,
        getSnapshot,
        useController,
        get controller() {
            return controller;
        },
        get focusedDate() {
            return focusedDate;
        },
        get month() {
            if (!monthGrid.length) {
                monthGrid = generateMonth(
                    focusedDate,
                    isFixed,
                    weekStartsOn,
                    controller.isSelected,
                    controller.isDisabled
                );
            }

            return monthGrid;
        }
    };

    return dp;
};

export function generateMonth (
    date: Date,
    isFixed: boolean,
    weekStartsOn: WeekStarts,
    isSelected: (date: Date) => boolean,
    isDisabled: (date: Date) => boolean
): IDay[] {
    const length = getMonthLength(date, { isFixed, weekStartsOn });
    const firstDayOfPrevMonth = subtractDay(
        setFirstDayOfMonth(date),
        calculatePrevMonthLength(date, weekStartsOn)
    );

    return Array.from({ length }, (_, i) => {
        const thisDate = addDay(firstDayOfPrevMonth, i);
        return createDay(thisDate, date, {
            isSelected: isSelected(thisDate),
            isDisabled: isDisabled(thisDate)
        });
    });
}
