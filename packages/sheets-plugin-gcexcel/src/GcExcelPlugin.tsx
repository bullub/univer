import { Plugin, SheetContext, UniverSheet } from '@univerjs/core';
import { zh, en } from './Locale';
import { GCEXCEL_PLUGIN_NAME } from './Basics/Const/PLUGIN_NAME';
import { GcExcelController } from './Controller/GcExcelController';

export interface IGcExcelPluginConfig {}

export class GcExcelPlugin extends Plugin<any, SheetContext> {
    private _gcExcelController: GcExcelController;

    constructor(config?: IGcExcelPluginConfig) {
        super(GCEXCEL_PLUGIN_NAME);
    }

    static create(config?: IGcExcelPluginConfig) {
        return new GcExcelPlugin(config);
    }

    installTo(universheetInstance: UniverSheet) {
        universheetInstance.installPlugin(this);
    }

    initialize(): void {
        /**
         * load more Locale object
         */
        this.getGlobalContext().getLocale().load({
            en,
            zh,
        });

        this._gcExcelController = new GcExcelController(this);
    }

    onMounted(): void {
        this.initialize();
    }

    onDestroy(): void {}
}
