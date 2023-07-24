import { addDay, isSame, setFirstDayOfMonth, subtractDay, today } from "../utils/date";
import { createEffect } from "../utils/effect";
import { getGridLength, getPrevMonthLength } from "../utils/helpers";
import { Subscribe, createObservable } from "../utils/observable";
import { createShare } from "../utils/share";
import { Controller, ControllerConfig, ControllerWithBus, createController } from "./controller";
import { IDay, createDay, updateDay } from "./day";
import { FocusCommand, focusCommandHandlers } from "./controller-focus";
import { ControllerCommand, FocusControllerCommand } from "../types/type";
import { castDate } from "../utils/common";

type DatePickerConfig = ControllerConfig & {
    controller?: Controller;
    defaultMonth?: Date | string;
    isFixed?: boolean;
}

export const createDatePicker = (config?: DatePickerConfig) => {
    const {controller: external, defaultMonth, isFixed = false, ...controllerConfig} = config || {};
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

    const update = createEffect(() => {
        version++;
        monthGrid.length = 0;
        observable.notify();
    });
    
    const recalculate = () => {
        monthGrid.forEach((day) => {
            const isDisabled = controller.isDisabled(day.date);
            const isSelected = !isDisabled && controller.isSelected(day.date);

            updateDay(day, update, { isSelected, isDisabled })
        })
    };

    const connect = () => (controller as ControllerWithBus).$$bus.subscribe(share.next);

    const replaceController = (next: Controller) => {
        update();
        controller = next;
        connectionDispose = connect();
    };

    const commandHandler = (command: ControllerCommand) => {
        const handler = focusCommandHandlers[command.type as FocusCommand];
    
        if (handler) {
            const previousDate = focusedDate;
            const { payload } = command as FocusControllerCommand;
    
            focusedDate = handler(focusedDate, payload);
    
            if (isSame(previousDate, focusedDate)) {
                return;
            }
    
            update();
            return;
        }
    
        recalculate();
    }

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
        controller,
        getSnapshot,
        replaceController,
        get month() {
            if (!monthGrid.length) {
                monthGrid = generateMonth(
                    focusedDate,
                    isFixed,
                    controller.isSelected,
                    controller.isDisabled
                );
            }
    
            return monthGrid;
        }
    }

    return dp;
}

function generateMonth (
    date: Date,
    isFixed: boolean,
    isSelected: (date: Date) => boolean,
    isDisabled: (date: Date) => boolean
): IDay[] {
    const length = getGridLength(date, isFixed);
    const firstDayOfPrevMonth = subtractDay(
        setFirstDayOfMonth(date),
        getPrevMonthLength(date)
    );

    return Array.from({length}, (_, i) => {
        const thisDate = addDay(firstDayOfPrevMonth, i);
        return createDay(thisDate, date, {
            isSelected: isSelected(thisDate),
            isDisabled: isDisabled(thisDate)
        });
    });
}
