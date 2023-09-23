/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SharedCommand } from "../utils";
import type { Controller, FocusCommand } from "../daygo-core";

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
