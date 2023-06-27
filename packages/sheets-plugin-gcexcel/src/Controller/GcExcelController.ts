import { BaseComponentRender } from '@univerjs/base-ui';
import { IToolbarItemProps, SHEET_UI_PLUGIN_NAME, SheetUIPlugin } from '@univerjs/ui-plugin-sheets';

import { GCEXCEL_PLUGIN_NAME } from '../Basics/Const';
import { GcExcelPlugin } from '../GcExcelPlugin';

export class GcExcelController {
    protected _sheetUIPlugin: SheetUIPlugin;

    protected _toolButton: IToolbarItemProps;

    protected _plugin: GcExcelPlugin;

    protected _render: BaseComponentRender;

    constructor(plugin: GcExcelPlugin) {
        this._plugin = plugin;
        this._sheetUIPlugin = plugin.getGlobalContext().getPluginManager().getRequirePluginByName<SheetUIPlugin>(SHEET_UI_PLUGIN_NAME);

        this._toolButton = {
            name: GCEXCEL_PLUGIN_NAME,
            toolbarType: 1, // ToolbarType.BUTTON,
            labelLocale: 'gcexcel.tooltip',
            tooltip: 'gcexcel.tooltip',
            show: true,
            onClick: () => {
                console.log('实现GcExcel数据绑定插件');
            },
        };
        this._sheetUIPlugin.addToolButton(this._toolButton);
    }
}
