import { IMouseEvent, IPointerEvent } from '@univerjs/base-render';
import { SheetPlugin } from '@univerjs/base-sheets';
import { BaseMenuItem, BaseSelectChildrenProps, ComponentChildren } from '@univerjs/base-ui';
import { PLUGIN_NAMES, Tools, UIObserver } from '@univerjs/core';
import { SheetUIPlugin } from '..';
import { DefaultRightMenuConfig, SheetRightMenuConfig } from '../Basics';
import { RightMenu, RightMenuInput, RightMenuItem } from '../View';
import styles from '../View/RightMenu/index.module.less';

interface CustomLabelProps {
    prefix?: string[] | string;
    suffix?: string[] | string;
    options?: BaseSelectChildrenProps[];
    label?: string;
    children?: CustomLabelProps[];
    onKeyUp?: (e: Event) => void;
    getPlaceholder?: () => string;
    getInputValue?: () => string;
}

export interface CustomLabel {
    name: string;
    props?: CustomLabelProps;
}

export interface RightMenuProps extends BaseMenuItem {
    label?: string | CustomLabel | ComponentChildren;
    children?: RightMenuProps[];
    suffix?: string;
    border?: boolean;
}

export class RightMenuUIController {
    private _plugin: SheetUIPlugin;

    private _sheetPlugin: SheetPlugin;

    private _rightMenu: RightMenu;

    private _menuList: RightMenuProps[];

    private _config: SheetRightMenuConfig;

    constructor(plugin: SheetUIPlugin, config?: SheetRightMenuConfig) {
        this._plugin = plugin;

        this._sheetPlugin = plugin.getUniver().getCurrentUniverSheetInstance().context.getPluginManager().getPluginByName<SheetPlugin>(PLUGIN_NAMES.SPREADSHEET)!;

        this._config = Tools.deepMerge({}, DefaultRightMenuConfig, config);

        this._menuList = [
            {
                label: 'rightClick.insertRow',
                onClick: () => this.insertRow(),
                show: this._config.InsertRow,
            },
            {
                label: 'rightClick.insertColumn',
                onClick: () => this.insertColumn(),
                show: this._config.InsertColumn,
            },
            {
                label: {
                    name: RightMenuInput.name,
                    props: {
                        prefix: 'rightClick.toTopAdd',
                        suffix: 'rightClick.row',
                    },
                },
                show: this._config.AddRowTop,
            },
            {
                label: {
                    name: RightMenuInput.name,
                    props: {
                        prefix: 'rightClick.toBottomAdd',
                        suffix: 'rightClick.row',
                    },
                },
                show: this._config.AddRowBottom,
            },
            {
                label: {
                    name: RightMenuInput.name,
                    props: {
                        prefix: 'rightClick.toLeftAdd',
                        suffix: 'rightClick.column',
                    },
                },
                show: this._config.AddColumnLeft,
            },
            {
                label: {
                    name: RightMenuInput.name,
                    props: {
                        prefix: 'rightClick.toRightAdd',
                        suffix: 'rightClick.column',
                    },
                },
                show: this._config.AddColumnRight,
            },
            {
                label: 'rightClick.deleteSelectedRow',
                onClick: () => this.deleteRow(),
                show: this._config.DeleteRow,
            },
            {
                label: 'rightClick.deleteSelectedColumn',
                onClick: () => this.deleteColumn(),
                show: this._config.DeleteColumn,
            },
            {
                label: 'rightClick.hideSelectedRow',
                show: this._config.HideRow,
            },
            {
                label: 'rightClick.showHideRow',
                show: this._config.ShowRow,
            },
            {
                label: {
                    name: RightMenuInput.name,
                    props: {
                        prefix: 'rightClick.rowHeight',
                        suffix: 'px',
                        onKeyUp: this.setRowHeight.bind(this),
                        getPlaceholder: this.getRowHeight.bind(this),
                        getInputValue: this.getRowHeight.bind(this),
                    },
                },
                onClick: () => {},
                // show: this._config.RowHeight,
                show: true,
            },
            {
                label: 'rightClick.hideSelectedColumn',
                show: this._config.HideColumn,
            },
            {
                label: 'rightClick.showHideColumn',
                show: this._config.ShowColumn,
            },
            {
                label: {
                    name: RightMenuInput.name,
                    props: {
                        prefix: 'rightClick.columnWidth',
                        suffix: 'px',
                        onKeyUp: this.setColumnWidth.bind(this),
                        getPlaceholder: this.getColumnWidth.bind(this),
                        getInputValue: this.getColumnWidth.bind(this),
                    },
                },
                // show: this._config.ColumnWidth,
                show: true,
            },
            {
                show: this._config.DeleteCell,
                label: {
                    name: RightMenuItem.name,
                    props: {
                        label: 'rightClick.deleteCell',
                    },
                },
                border: true,
                children: [
                    {
                        label: 'rightClick.moveLeft',
                        className: styles.rightMenuCenter,
                        onClick: () => this.deleteCellLeft(),
                    },
                    {
                        label: 'rightClick.moveUp',
                        className: styles.rightMenuCenter,
                        onClick: () => this.deleteCellTop(),
                    },
                ],
            },
            {
                label: 'rightClick.clearContent',
                onClick: () => this.clearContent(),
                border: true,
                show: this._config.ClearContent,
            },
            // {
            //     show: this._config.hideMatrix,
            //     label: {
            //         name: RightMenuItem.name,
            //         props: {
            //             label: 'rightClick.matrix',
            //         },
            //     },
            //     children: [
            //         {
            //             label: {
            //                 name: RightMenuButton.name,
            //                 props: {
            //                     label: 'rightClick.flip',
            //                     children: [
            //                         {
            //                             label: 'rightClick.upAndDown',
            //                         },
            //                         {
            //                             label: 'rightClick.leftAndRight',
            //                         },
            //                     ],
            //                 },
            //             },
            //         },
            //         {
            //             label: {
            //                 name: RightMenuButton.name,
            //                 props: {
            //                     label: 'rightClick.flip',
            //                     children: [
            //                         {
            //                             label: 'rightClick.clockwise',
            //                         },
            //                         {
            //                             label: 'rightClick.counterclockwise',
            //                         },
            //                     ],
            //                 },
            //             },
            //         },
            //         {
            //             label: ['rightClick.transpose'],
            //         },
            //         {
            //             label: {
            //                 name: RightMenuSelect.name,
            //                 props: {
            //                     label: 'rightClick.matrixCalculation',
            //                     options: [
            //                         {
            //                             label: 'rightClick.plus',
            //                         },
            //                         {
            //                             label: 'rightClick.minus',
            //                         },
            //                         {
            //                             label: 'rightClick.multiply',
            //                         },
            //                         {
            //                             label: 'rightClick.divided',
            //                         },
            //                         {
            //                             label: 'rightClick.power',
            //                         },
            //                         {
            //                             label: 'rightClick.root',
            //                         },
            //                         {
            //                             label: 'rightClick.log',
            //                         },
            //                     ],
            //                 },
            //             },
            //         },
            //         {
            //             label: {
            //                 name: RightMenuButton.name,
            //                 props: {
            //                     label: 'rightClick.delete0',
            //                     children: [
            //                         {
            //                             label: 'rightClick.byRow',
            //                         },
            //                         {
            //                             label: 'rightClick.byCol',
            //                         },
            //                     ],
            //                 },
            //             },
            //         },
            //         {
            //             label: {
            //                 name: RightMenuButton.name,
            //                 props: {
            //                     label: 'rightClick.removeDuplicate',
            //                     children: [
            //                         {
            //                             label: 'rightClick.byRow',
            //                         },
            //                         {
            //                             label: 'rightClick.byCol',
            //                         },
            //                     ],
            //                 },
            //             },
            //         },
            //     ],
            // },
        ];

        this._initialize();
    }

    // 获取RightMenu组件
    getComponent = (ref: RightMenu) => {
        this._rightMenu = ref;
        this.setMenuList();
    };

    // 刷新
    setMenuList() {
        this._rightMenu?.setMenuList(this._menuList);
    }

    setUIObserve<T>(msg: UIObserver<T>) {
        this._plugin.getContext().getObserverManager().requiredObserver<UIObserver<T>>('onUIChangeObservable', 'core').notifyObservers(msg);
    }

    insertRow() {
        const msg = {
            name: 'insertRow',
        };
        this.setUIObserve(msg);
    }

    insertColumn() {
        const msg = {
            name: 'insertColumn',
        };
        this.setUIObserve(msg);
    }

    deleteRow() {
        const msg = {
            name: 'deleteRow',
        };
        this.setUIObserve(msg);
    }

    deleteColumn() {
        const msg = {
            name: 'deleteColumn',
        };
        this.setUIObserve(msg);
    }

    getRowHeight() {
        const workSheet = this._plugin.getContext().getUniver().getCurrentUniverSheetInstance().getWorkBook().getActiveSheet();
        const defaultHeight = workSheet.getConfig().defaultRowHeight;
        let height = defaultHeight.toString();
        const selectionManager = this._sheetPlugin.getSelectionManager();
        const selectionCell = selectionManager.getCurrentModel();
        if (selectionCell && selectionCell.startRow === selectionCell.endRow) {
            height = workSheet.getRowHeight(selectionCell.startRow).toString();
        }
        return height;
    }

    setRowHeight(e: Event) {
        console.dir(this._plugin.getContext().getUniver().getCurrentUniverSheetInstance().getWorkBook().getActiveSheet().getConfig());
        console.dir(this._plugin.getContext().getUniver().getCurrentUniverSheetInstance().getWorkBook().getStyles());

        // if ((e as KeyboardEvent).key !== 'Enter') {
        //     return;
        // }
        const height = (e.target as HTMLInputElement).value;
        if (Number(height) <= 0) return;
        const msg = {
            name: 'setRowHeight',
            value: height,
        };
        this.setUIObserve(msg);
    }

    getColumnWidth() {
        const workSheet = this._plugin.getContext().getUniver().getCurrentUniverSheetInstance().getWorkBook().getActiveSheet();
        const defaultWidth = workSheet.getConfig().defaultColumnWidth;
        let width = defaultWidth.toString();
        const selectionManager = this._sheetPlugin.getSelectionManager();
        const selectionCell = selectionManager.getCurrentModel();
        if (selectionCell && selectionCell.startColumn === selectionCell.endColumn) {
            width = workSheet.getColumnWidth(selectionCell.startColumn).toString();
        }
        return width;
    }

    setColumnWidth(e: Event) {
        // if ((e as KeyboardEvent).key !== 'Enter') {
        //     return;
        // }
        const width = (e.target as HTMLInputElement).value;
        if (Number(width) <= 0) return;
        const msg = {
            name: 'setColumnWidth',
            value: width,
        };
        this.setUIObserve(msg);
    }

    deleteCellLeft() {
        const msg = {
            name: 'moveLeft',
        };
        this.setUIObserve(msg);
    }

    deleteCellTop() {
        const msg = {
            name: 'moveTop',
        };
        this.setUIObserve(msg);
    }

    clearContent() {
        const msg = {
            name: 'clearContent',
        };
        this.setUIObserve(msg);
    }

    private _initialize() {
        this._plugin.getComponentManager().register(RightMenuInput.name, RightMenuInput);
        this._plugin.getComponentManager().register(RightMenuItem.name, RightMenuItem);

        this._sheetPlugin.getMainComponent().onPointerDownObserver.add((evt: IPointerEvent | IMouseEvent) => {
            if (evt.button === 2) {
                evt.preventDefault();
                this._rightMenu.handleContextMenu(evt);
            }
        });
    }
}
