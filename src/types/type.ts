/* eslint-disable @typescript-eslint/no-explicit-any */
import { FocusCommand } from "../core/controller-focus"
import { SharedCommand } from "../core/controller-base";
import { Controller } from "../core/controller";

export type FocusControllerCommand = {
    type: FocusCommand;
    payload: any;
}

export type SharedControllerCommand = {
    type: SharedCommand;
}

export type ControllerCommand = SharedControllerCommand | FocusControllerCommand;

export type CustomParser = (date: string) => Date;

export type EventSubscriber = (controller: Controller) => void;