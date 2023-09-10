import { createController } from "@daygo/core";
import { useConst } from "./use-const";
import type { Controller, ControllerConfig } from "@daygo/core";

export const useCreateController = (config?: ControllerConfig): Controller => {
	return useConst(() => createController(config));
};
