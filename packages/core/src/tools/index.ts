import { castDate, isSame, isValidDateInput } from "../utils";
import type { CustomParser } from "../types/type";
import type { DateRange, DateRangeRaw } from "../utils";

export const rangeToDate = (range: DateRange) => {
	const { from = null, to = null } = range;
	if (isSame(from, to)) return from || to;
	return null;
};

export const getRange = (date: Date | undefined, customParser?: CustomParser) => {
	const value = date && castDate(date, customParser);
	return { from: value, to: value };
};

export const toValidRange = (range: DateRangeRaw, customParser?: CustomParser): DateRange => {
	const from = isValidDateInput(range.from) ? castDate(range.from, customParser) : range.from;
	const to = isValidDateInput(range.to) ? castDate(range.to, customParser) : range.to;
	return { from, to };
};
