import {Observable} from "../utils/observable";

export type DisabledDatesRange = {
    from?: DatePickerDate;
    to?: DatePickerDate;
}

export type DisabledDate = DisabledDatesRange | DatePickerDate;
export type DisabledDates = Array<DisabledDate>;

export type DatePickerDate = Date | string;

export type DPWorkerConfig = DPControllerConfig & {
    controller: DPController;
    offset?: number;
}

export type DPConfig = DPControllerConfig & DPWorkerConfig; 

export type DPControllerConfig = {
    defaultDate?: DatePickerDate;
    selectedDates?: DPSelectedDates;
    disabledDates?: DisabledDates;
    parse?: DPCustomDateParser;
}

export type DPSnapshot = {
    current: Date;
    monthGrid: DPDay[];
    controller: DPController;
}

export interface DP {
    subscribe(subscriber: Handler): Handler;
    getSnapshot(): DPSnapshot;
    setController(controller: DPController): void;
    dispose(): void;
}

export interface DPDay {
    readonly date: Date;
    readonly iso: string;
    readonly isToday: boolean;
    readonly dayNumber: number;
    readonly isWeekend: boolean;
    readonly isDisabled: boolean;
    readonly isSelected: boolean;
    readonly isNextMonth: boolean;
    readonly isSelectionEnd: boolean;
    readonly isCurrentMonth: boolean;
    readonly isPreviousMonth: boolean;
    readonly isSelectionBegin: boolean;
}

export type ObservableProps = keyof Pick<DPDay, 'isSelected' | 'isSelectionBegin' | 'isSelectionEnd' | 'isDisabled'>;
export type DPDayInitState = Record<ObservableProps, boolean>;


export interface DPController {
    showToday(): void;
    showDate(date: DatePickerDate): void;
    showYear(year: number | DatePickerDate): void;
    showMonth(month: number | DatePickerDate): void;
    showNextMonth(offset?: number): void;
    showPrevMonth(offset?: number): void;
    showNextYear(offset?: number): void;
    showPrevYear(offset?: number): void;

    selectDate(date: DatePickerDate): void;
    unselectDate(date: DatePickerDate): void;
    selectDateToggle(date: DatePickerDate): void;

    selectStartStop(date: Date): void;
    selectDateCursor(date: Date): void;

    // selectDateRange(date1: Date | null, date2: Date | null): void;
    // selectDateRangeEnd(date: Date | null): void;
    // selectDateRangeStart(date: Date | null): void;

    disableDates(dates: DisabledDate | DisabledDates): void;
    enableDates(dates: DisabledDate | DisabledDates): void;
    toggleDisabled(dates: DisabledDate | DisabledDates): void;

    resetSelection(): void;
    resetSelectionRange(): void;

    isDisabled(date: DatePickerDate): boolean;
    isSelected(date: DatePickerDate): boolean;

    on(event: string, fn: () => void): void;
    getSelected(): DPSelectedState;
    getDisabled(): DPDisabledState;
    getCurrent(): Date;
}

export type Handler = () => void;

export enum DPEvents {
    SELECTION_CHANGE_STOP = 'SELECTION_CHANGE_STOP',
    SELECTION_CHANGE_START = 'SELECTION_CHANGE_START',
    SELECTION_CHANGE_UPDATE = 'SELECTION_CHANGE_UPDATE',
    DISABLED_CHANGE_UPDATE = 'DISABLED_CHANGE_UPDATE',
    CURRENT_CHANGED = 'CURRENT_CHANGED'
}

export type DPSelectedRange = {
    to: Date | null;
    from: Date | null;
}

export type DPSelectedList = DatePickerDate[];

export type DPSelectedState = DPSelectedRange & {
    list: DPSelectedList;
}

export type DPSelectedDates = DatePickerDate | DPSelectedRange | DPSelectedState | DPSelectedList;

export type DPDisabledState = string[];
export type DPCommonSubscriber = (() => void) | Observable<any>;
export type DPCustomDateParser = (date?: string) => Date;