/* eslint-disable @typescript-eslint/no-explicit-any */
import { FocusCommand } from "../core/controller-focus"
import { SharedCommand } from "../core/controller-basic";

export type FocusControllerCommand = {
    type: FocusCommand;
    payload: any;
}

export type SharedControllerCommand = {
    type: SharedCommand;
}

export type ControllerCommand = SharedControllerCommand | FocusControllerCommand;
