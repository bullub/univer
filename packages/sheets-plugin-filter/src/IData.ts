import { SheetContext } from '@univerjs/core';
import { FilterPlugin } from './FilterPlugin';

export type IConfig = {
    context: SheetContext;
};

// Types for props
export type IProps = { config: IConfig; super: FilterPlugin };
