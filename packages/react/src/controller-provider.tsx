import * as React from "react";
import type { Controller } from "@daygo/core";
import type { FC, PropsWithChildren } from "react";

export const ControllerContext = React.createContext({} as Controller);
export type ControllerProviderProps = {
    controller: Controller;
}

export const ControllerProvider: FC<PropsWithChildren<ControllerProviderProps>> = ({ children, controller }) => {
	return (
		<ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>
	);
};

export const useController = () => {
	return React.useContext(ControllerContext);
};
