import { ICellData, IStyleData } from '../../Interfaces';
import { Nullable, Tools } from '../../Shared';
import { ObjectMatrix } from '../../Shared/ObjectMatrix';
import { mergeStyle, transformStyle } from './SetRangeStyle';
import { CommandUnit } from '../../Command';
import { ISetRangeDataActionData } from '../Action';

export function SetRangeDataApply(unit: CommandUnit, data: ISetRangeDataActionData) {
    const workbook = unit.WorkBookUnit;
    const worksheet = workbook!.getSheetBySheetId(data.sheetId)!;
    const cellMatrix = worksheet.getCellMatrix();
    const options = data.options;
    const addMatrix = data.cellValue;
    const styles = workbook!.getStyles();

    const target = new ObjectMatrix(addMatrix);
    const result = new ObjectMatrix<ICellData>();

    if (options) {
        target.forValue((r, c, value) => {
            const cell = cellMatrix.getValue(r, c);
            const newCell: ICellData = {};

            if (options.contentsOnly) {
                newCell.m = cell?.m;
                newCell.v = cell?.v;
            }

            if (options.formatOnly) {
                // newCell.f = cell?.f;
                newCell.v = cell?.v;
                newCell.m = cell?.m;
            }

            result.setValue(r, c, newCell || {});

            cellMatrix.setValue(r, c, value || {});
        });

        return result.getData();
    }
    target.forValue((r, c, value) => {
        const cell = cellMatrix.getValue(r, c) || {};

        // set null, clear cell
        if (!value) {
            cellMatrix.setValue(r, c, value);
            result.setValue(r, c, cell);
        } else {
            // update style

            // use null to clear style
            const old = styles.getStyleByCell(cell);

            // store old data
            const oldCellStyle = transformStyle(
                old,
                value?.s as Nullable<IStyleData>
            );
            const oldCellData = Tools.deepClone(cell);
            oldCellData.s = oldCellStyle;

            result.setValue(r, c, oldCellData);

            if (old == null) {
                // clear
                delete cell.s;
            }

            // set style
            const merge = mergeStyle(old, value?.s as Nullable<IStyleData>);

            // then remove null
            merge && Tools.removeNull(merge);

            if (Tools.isEmptyObject(merge)) {
                delete cell.s;
            } else {
                cell.s = styles.setValue(merge);
            }

            // update other value TODO: move
            if (value.p != null) {
                cell.p = value.p;
            }

            // When undoing, the cell may have a null value state before it
            cell.v = value.v || '';
            cell.m = value.m || String(cell.v);

            if (value.t != null) {
                cell.t = value.t;
            }

            cellMatrix.setValue(r, c, cell);
        }
    });
    return result.getData();
}
