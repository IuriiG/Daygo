Daygo is a library for quickly and easily creating a date picker component. Instead of using components with a ready-made UI and creating a lot of complex customizations for it, Daygo offers a headless approach.

## At a Glance
```tsx
import React from 'react';
import { useDatePicker } from "@daygo/react";

function DatePicker() {
    const dp = useDatePicker();
    return (
        <div className={/* some classes here */}>
            {
                dp.month.map(({date, iso}) => {
                    return (
                        <div
                            key={iso}
                            onClick={() => dp.controller.startStopRangeAuto(date)}
                            onMouseMove={() => dp.controller.updateRangeAuto(date)}
                            className={/* some classes here */}
                        >
                            {date.getDate()}
                        </div>
                    )
                })
            }
        </div>
    );
}

export default DatePicker;
```

Try this code in [playground](https://stackblitz.com/edit/stackblitz-starters-uwwnan?file=src%2FDatePicker.tsx)!

## Key Features

- **Simple to use and scalable**. It doesn't matter if you render for one month or a whole year. One code for all cases.
- **Powerful**. Many date picking scenarious you could implement using only that library.
- **Customizable**. The headless approach allows you to realize any designer’s ideas.
- Single and multiple date selection, flexible range selection.
- **Lazy calculations**. The new state of each month is calculated independently of each other and only at the moment of reading it.
- **Batching**. No useless component rerenders. You write synchronous code and only the final result will be rendered.
- **Based on native Date**. You can use any library for working with dates (dayjs, momen.js, date-fns, etc.)
- Zero dependencies. Based only on the Daygo core package.
- **Tiny**. ~ 1kb gzipped for react binding package and ~4kb gzipped for core package.
- Support react **^16.8.0**, react **^17.0.0** and react **^18.0.0**

##Install
```sh
npm i @daygo/react
```
## Main concept

The main concept of Daygo is the **controller**. The controller switch the displayed month, select dates, store selected and disabled dates etc. All control is done through it.

The controller uses commands for controling the datepicker. Thus, one controller can control an unlimited number of daypickers, and synchronization of displays between months is easily achieved. Each datepicker listens to controller commands and changes its state depending on the received command. In this case, the calculation of a new month is carried out only if this month is read and drawn. In this way, you can achieve synchronization of the date picker even if the month is not being displayed right now.

## Index 

 - [Controller](#controller)
   - [focusToday](#focustoday)
   - [focusDate](#focusdate)
   - [focusMonth](#focusmonth)
   - [focusYear](#focusyear)
   - [focusNextMonth](#focusnextmonth)
   - [focusPrevMonth](#focusprevmonth)
   - [focusNextYear](#focusnextyear)
   - [focusPrevYear](#focusprevyear)
   - [selectDate](#selectdate)
   - [toggleSelectDate](#toggleselectdate)
   - [selectDateMultiple](#selectdatemultiple)
   - [startStopRangeAuto](#startstoprangeauto)
   - [updateRangeAuto](#updaterangeauto)
   - [selectAll](#selectall)
   - [unselectAll](#unselectall)
   - [unselectDate](#unselectdate)
   - [disableDate](#disabledate)
   - [disableDateToggle](#disabledatetoggle)
   - [enableDate](#enabledate)
   - [disableAll](#disableall)
   - [enableAll](#enableall)
   - [isDisabled](#isdisabled)
   - [isSelected](#isselected)
   - [getState](#getstate)
   - [getSelected](#getselected)
   - [getDisabled](#getdisabled)
   - [getConfig](#getconfig)
   - [resetDefaults](#resetdefaults)
   - [resetDefaultsFocus](#resetdefaultsfocus)
   - [resetDefaultsSelected](#resetdefaultsselected)
   - [resetDefaultsDisabled](#resetdefaultsdisabled)
   - [onFocusChange](#onfocuschange)
   - [onSelectChange](#onselectchange)
   - [onDisableChange](#ondisablechange)
   - [clear](#clear)
 - [DatePicker](#datepicker)
   - [month](#month)
   - [focusedDate](#focuseddate)
   - [controller](#controller-1)
   - [subscribe](#subscribe)
   - [getSnapshot](#getsnapshot)
   - [useController](#usecontroller)
 - [Day](#day)
   - [date](#date)
   - [iso](#iso)
   - [isToday](#istoday)
   - [isWeekend](#isweekend)
   - [isDisabled](#isdisabled-1)
   - [isSelected](#isselected-1)
   - [isCurrentMonth](#iscurrentmonth)
 - [Configuration](#configuration)
   - [ControllerConfig](#controllerconfig)
   - [DatePickerConfig](#datepickerconfig)

### Controller

#### focusToday
soon
#### focusDate
soon
#### focusMonth
soon
#### focusYear
soon
#### focusNextMonth
soon
#### focusPrevMonth
soon
#### focusNextYear
soon
#### focusPrevYear
soon
#### selectDate
soon
#### toggleSelectDate
soon
#### selectDateMultiple
soon
#### startStopRangeAuto
soon
#### updateRangeAuto
soon
#### selectAll
soon
#### unselectAll
soon
#### unselectDate
soon
#### disableDate
soon
#### disableDateToggle
soon
#### enableDate
soon
#### disableAll
soon
#### enableAll
soon
#### isDisabled
soon
#### isSelected
soon
#### getState
soon
#### getSelected
soon
#### getDisabled
soon
#### getConfig
soon
#### resetDefaults
soon
#### resetDefaultsFocus
soon
#### resetDefaultsSelected
soon
#### resetDefaultsDisabled
soon
#### onFocusChange
soon
#### onSelectChange
soon
#### onDisableChange
soon
#### clear
soon

### DatePicker

#### month
soon
#### focusedDate
soon
#### controller
soon
#### subscribe
soon
#### getSnapshot
soon
#### useController
soon

### Day

#### date
soon
#### iso
soon
#### isToday
soon
#### isWeekend
soon
#### isDisabled
soon
#### isSelected
soon
#### isCurrentMonth
soon

### Configuration

#### ControllerConfig
soon
#### DatePickerConfig
soon
