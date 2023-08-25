import { useState, useSyncExternalStore } from "react";
import { createDatePicker } from "./core/date-picker"
import { useConst } from "./hooks/useConst"
import { Controller } from "./core/controller";
import { mergeRanges } from "./tools";
import { addMonth, today } from "./utils/date";

let count = 0;
let grid: any;

const m = {
    c: 0,
    get p() {
        return ++this.c;
    }
}

/**
0

2 - 0 = 2

0 1 2 3  4 5 6
30 31 1 2 3  4 5
6 7 8 9 10 11 12

 */

/**
1

2 - 1 = 1

31 1 2 3  4 5 6
7 8 9 10 11 12 13

 */

/**
2

2 - 2 = 0

25 26 27 28 29 30 31
1 2 3  4 5 6 7
8 9 10 11 12 13 14

 */
/**
3

2 - 3 = -1

26 27 28 29 30 31 1
2 3  4 5 6 7 8
9 10 11 12 13 14 15

 */



function App() {
    const dp = useConst(() => createDatePicker({isFixed: true, weekStartsOn: 1 }));
    const [isSelect, setIsSelect] = useState(true);
    const toggle = () => setIsSelect(prev => !prev)
    const c = dp.controller;

    useSyncExternalStore(dp.subscribe, dp.getSnapshot, dp.getSnapshot);

    console.log('[[RENDER DATE PICKER]]', count++)
    // const {month} = dp;
    const isSameGrid = grid === dp.month;

    if (!isSameGrid) {
        grid = dp.month;
    }

    console.log('*** IS SAME GRID ***: ', isSameGrid);

    // console.log(dp.monthGrid)
    
    console.log('[C]: ', m.p)

    // console.table(month)

    // c.disableDate()
    // c.disableDateToggle()
    // c.enableDate()
    // c.getDisabled()
    // c.getSelected()
    // c.isDisabled()
    // c.isSelected()
    // c.onDisableChange((controllerLocal: Controller) => {
    //     controllerLocal.showNextMonth();
    // })
    // c.onSelectChange()
    // c.resetDisabled()
    // c.resetSelected()
    // c.selectDate()
    // c.selectDateMultiple()
    // c.showDate()
    // c.showMonth()
    // c.showNextMonth()
    // c.showNextYear()
    // c.showPrevMonth()
    // c.showPrewYear()
    // c.showToday()
    // c.showYear()
    // c.startStopSelectRange()
    // c.toggleSelectDate()
    // c.unselectDate()
    // c.updateRangeAuto()
    
    return (
        <>
        <div style={{
            display: "grid",
            gridTemplateColumns: 'repeat(7, 1fr)',
            width: '500px',
            gap: '5px'
        }}>
            {
                dp.month.map((day) => {
                    // if (day.isSelected) {
                    //     console.log(day)
                    // }
                    const background = day.isDisabled ? 'gray' : day.isSelected ? 'red' : 'transparent';
                    const outline = day.isToday ? '2px solid red' : '1px solid black';
                    // console.table({date: day.date, isSelected: day.isSelected, background})
                    // console.log(day.iso, day.date.toISOString(), day.date)
                    // console.log(day.iso, outline)
                    return (
                        <div key={day.iso}
                            // onClick={() => dp.controller.selectDate(day.date)}
                            onClick={() => dp.controller.toggleSelectDate(day.date)}
                            // onClick={() => dp.controller.disableDate(day.date)}
                            onContextMenu={(e) => {e.preventDefault(), dp.controller.disableDate(day.date)}}
                            // onClick={() => dp.controller.disableDateToggle(day.date)}
                            // onClick={() => dp.controller.focusDate(addMonth(day.date, 1))}
                            // onClick={() => dp.controller.focusToday()}
                            // onClick={() => dp.controller.toggleSelectDate(day.date)}
                            // onClick={() => dp.controller.toggleSelectDate(day.date)}
                            // onClick={() => dp.controller.selectDate(day.date)}
                            // onClick={() => dp.controller.startStopRangeAuto(day.date)}
                            // onMouseMove={() => dp.controller.updateRangeAuto(day.date)}
                            // onClick={() => {
                            //     if (isSelect) {
                            //         dp.controller.startStopRangeAuto(day.date)
                            //         return
                            //     }

                            //     dp.controller.toggleSelectDate(day.date);
                            // }}
                        style={{
                            outline,
                            background,
                            height: '20px',
                            cursor: 'pointer'
                        }}>
                            {day.date.getDate()}
                        </div>
                    )
                })
            }
        </div>
        <div>{dp.focusedDate.toDateString()}</div>
        <div>
            <button type='button' onClick={() => dp.controller.focusPrevMonth()}>PREV MONTH</button>
            <button type='button' onClick={() => dp.controller.focusNextMonth()}>NEXT MONTH</button>
            <button type='button' onClick={toggle}>TOGGLE IS SELECT</button>
            <button type='button' onClick={() => {
                console.log(dp.controller.getSelected())
            }}>GET SELECTED</button>
            <button type='button' onClick={() => {
                console.log(dp.controller.getDisabled())
            }}>GET DISABLED</button>
            <button type='button' onClick={() => {
                console.log(dp.controller.getState())
            }}>GET STATE</button>
            <button type='button' onClick={() => {
                dp.controller.selectDate({
                    from: new Date('2023-08-10'),
                    to: new Date('2023-08-15')
                })
            }}>SELECT MULTIPLE</button>
            <button type='button' onClick={() => {
                dp.controller.unselectDate({
                    from: new Date('2023-08-12'),
                    to: new Date('2023-08-14')
                })
            }}>UNSELECT MULTIPLE</button>
        </div>
        <div>
            <button type='button' onClick={() => {
                dp.controller.selectAll();
                console.log(dp.controller.getState())
            }}>SELECT ALL</button>
            <button type='button' onClick={() => {
                dp.controller.unselectAll()
                console.log(dp.controller.getState())
            }}>UNSELECT ALL</button>
            <button type='button' onClick={() => {
                dp.controller.selectDateMultiple({from: today()})
                console.log(dp.controller.getState())
            }}>SELECT FUTURE</button>
            <button type='button' onClick={() => {
                dp.controller.selectDateMultiple({to: today()})
                console.log(dp.controller.getState())
            }}>SELECT PAST</button>
        </div>
        <div>
            <button type='button' onClick={() => {
                dp.controller.disableAll();
                console.log(dp.controller.getState())
            }}>DISABLE ALL</button>
            <button type='button' onClick={() => {
                dp.controller.enableAll()
                console.log(dp.controller.getState())
            }}>ENABLE ALL</button>
            <button type='button' onClick={() => {
                dp.controller.disableDate({from: today()})
                console.log(dp.controller.getState())
            }}>DISABLE FUTURE</button>
            <button type='button' onClick={() => {
                dp.controller.disableDate({to: today()})
                console.log(dp.controller.getState())
            }}>DISABLE PAST</button>
            <button type='button' onClick={() => {
                dp.controller.enableDate({from: today()})
                console.log(dp.controller.getState())
            }}>ENABLE FUTURE</button>
            <button type='button' onClick={() => {
                dp.controller.enableDate({to: today()})
                console.log(dp.controller.getState())
            }}>ENABLE PAST</button>
        </div>
        <div>
            <button type='button' onClick={() => {
                dp.controller.clear();
                console.log(dp.controller.getState())
            }}>CLEAR</button>
        </div>
        </>
    )
}

export default App
