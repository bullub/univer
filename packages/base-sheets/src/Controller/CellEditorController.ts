import { Direction, IDocumentData, IRangeData, IStyleData, Nullable, ICellData, handleJsonToDom } from '@univerjs/core';
import { SheetPlugin } from '../SheetPlugin';

/**
 * Cell Editor
 */
export class CellEditorController {
    isEditMode: boolean;

    // current edit cell
    currentEditRangeData: IRangeData;

    private _plugin: SheetPlugin;

    constructor(plugin: SheetPlugin) {
        this._plugin = plugin;
    }

    setEditMode(value: boolean) {
        this.isEditMode = value;
    }

    getEditMode() {
        return this.isEditMode;
    }

    setCurrentEditRangeData() {
        const currentCell = this._plugin.getSelectionManager().getCurrentCellModel();
        if (!currentCell) return;

        let row;
        let column;

        if (currentCell.isMerged) {
            const mergeInfo = currentCell.mergeInfo;
            row = mergeInfo.startRow;
            column = mergeInfo.startColumn;
        } else {
            row = currentCell.row;
            column = currentCell.column;
        }

        this.currentEditRangeData = {
            startRow: row,
            startColumn: column,
            endRow: row,
            endColumn: column,
        };
    }

    getCurrentEditRangeData() {
        return this.currentEditRangeData;
    }

    setCurrentEditRangeValue(cell: ICellData) {
        // only one selection
        const { startRow, startColumn, endRow, endColumn } = this.currentEditRangeData;
        const range = this._plugin.getContext().getWorkBook().getActiveSheet().getRange(startRow, startColumn, endRow, endColumn);

        range.setRangeData(cell);

        // this._plugin.getMainComponent().makeDirty(true);
    }

    getSelectionValue(): string {
        const range = this._plugin.getSelectionManager().getActiveRange();
        if (!range) return '';

        const value = range && range.getDisplayValue();
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object' && value !== null) {
            return handleJsonToDom(value);
        }
        return '';
    }

    getSelectionStyle(): Nullable<IStyleData> {
        return this._plugin.getSelectionManager().getActiveRange()?.getTextStyle();
    }

    setSelectionValue(value: IDocumentData | string) {
        const range = this._plugin.getSelectionManager().getActiveRange();
        if (!range) return;

        if (typeof value === 'string') {
            range.setValue(value);
        }
        if (typeof value === 'object') {
            range.setRangeData({ p: value });
        }

        // this._plugin.getMainComponent().makeDirty(true);
    }

    handleBackSpace() {}

    handleDirection(direction: Direction) {
        // todo
    }
}
