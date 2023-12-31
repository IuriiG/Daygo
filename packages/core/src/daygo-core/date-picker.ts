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
import type { Simplify } from "../types";
import type {
	Subscribe,
	WeekStarts } from "../utils";
import type { IDay } from "./day";
import type { FocusCommand } from "./controller-focus";
import type { Controller, ControllerConfig, ControllerWithBus } from "./controller";
import type { ControllerCommand, FocusControllerCommand } from "../types/type";

export type ControlledDatePickerConfig = {
	readonly controller: Controller;
	readonly isFixed?: boolean;
	readonly weekStartsOn?: WeekStarts;
	readonly defaultMonth?: Date | string;
}

export type UncontrolledDatePickerConfig = Simplify<ControllerConfig & Omit<ControlledDatePickerConfig, 'controller'>>;
export type DatePickerConfig = UncontrolledDatePickerConfig | ControlledDatePickerConfig;

export interface IDatePicker {
    readonly month: IDay[];
    readonly focusedDate: Date;
    readonly subscribe: Subscribe;
    readonly controller: Controller;
    readonly getSnapshot: () => number;
    readonly useController: (controller: Controller) => void;
}

export function createDatePicker (config: ControlledDatePickerConfig): IDatePicker;
export function createDatePicker (config?: UncontrolledDatePickerConfig): IDatePicker;
export function createDatePicker (config: DatePickerConfig = {}): IDatePicker {
	const {
		defaultMonth,
		isFixed = false,
		weekStartsOn = 1,
		// @ts-ignore
		controller: external,
		...controllerConfig
	} = config;

	let connectionDispose: () => void;
	let controller: Controller = external ?? createController(controllerConfig);

	const customParser = controller.getConfig()?.customParser;
	const parseDefaultMonth = () => setFirstDayOfMonth(
		defaultMonth
			? castDate(defaultMonth, customParser)
			: today()
	);

	let version = 0;
	let monthGrid: IDay[] = [];
	let focusedDate = parseDefaultMonth();

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
		if (controller === next) {
			return;
		}

		scheduleRender();
		connectionDispose();

		controller = next;
		connectionDispose = connect();
	};

	const updateFocusedDate = (date: Date) => {
		date = setFirstDayOfMonth(date);

		if (isSame(focusedDate, date)) {
			return;
		}

		focusedDate = date;
		scheduleRender();
	};

	const commandHandler = (command: ControllerCommand) => {
		const handler = focusCommandHandlers[command.type as FocusCommand];

		if (handler) {
			const date = handler(focusedDate, (command as FocusControllerCommand).payload);
			updateFocusedDate(date ?? parseDefaultMonth());
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
