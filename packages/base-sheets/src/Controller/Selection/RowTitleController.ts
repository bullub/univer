import { CURSOR_TYPE, Group, IMouseEvent, IPointerEvent, Rect } from '@univerjs/base-render';
import { EventState, Nullable } from '@univerjs/core';
import { DragLineDirection } from './DragLineController';
import { SelectionManager } from './SelectionManager';

export class RowTitleController {
    private _manager: SelectionManager;

    private _leftTopHeight: number;

    private _startOffsetX: number = 0;

    private _startOffsetY: number = 0;

    private _index: number = 0;

    private _currentHeight: number = 0;

    private _highlightItem: Group;

    private _content: Rect;

    private _Item: Rect;

    constructor(manager: SelectionManager) {
        this._manager = manager;
        this._leftTopHeight = this._manager.getSheetView().getSpreadsheetLeftTopPlaceholder().getState().height;

        const width = this._manager.getSheetView().getSpreadsheetSkeleton().rowTitleWidth;
        // 创建高亮item
        this._content = new Rect('RowTitleContent', {
            width,
            height: 0,
            top: 0,
            fill: 'rgb(220,220,220,0.5)',
        });
        this._Item = new Rect('RowTitleItem', {
            width,
            height: 5,
            top: 0,
            fill: 'rgb(220,220,220,0.5)',
        });
        this._highlightItem = new Group('RowTitleGroup', this._content, this._Item);
        this._highlightItem.hide();

        const scene = this._manager.getScene();

        scene.addObject(this._highlightItem, 3);

        this._initialize();
    }

    pointerDown(e: IPointerEvent | IMouseEvent) {
        const main = this._manager.getMainComponent();
        const { offsetX: evtOffsetX, offsetY: evtOffsetY } = e;
        this._startOffsetX = evtOffsetX;
        this._startOffsetY = evtOffsetY;
        const scrollXY = main.getAncestorScrollXY(this._startOffsetX, this._startOffsetY);
        const clientY = e.offsetY + scrollXY.y - this._leftTopHeight;
        const rowHeightAccumulation = main.getSkeleton()?.rowHeightAccumulation ?? [];

        for (let i = 0; i < rowHeightAccumulation?.length; i++) {
            if (rowHeightAccumulation[i] >= clientY) {
                this._index = i;
                break;
            }
        }
        // 当前列宽度
        this._currentHeight = rowHeightAccumulation[0];
        if (this._index) {
            this._currentHeight = rowHeightAccumulation[this._index] - rowHeightAccumulation[this._index - 1];
        }

        // 显示拖动线
        if (rowHeightAccumulation[this._index] - clientY <= 5) {
            const end = rowHeightAccumulation[this._index] + this._leftTopHeight;
            const start = (this._index ? rowHeightAccumulation[this._index - 1] : 0) + this._leftTopHeight;

            this._manager.getDragLineControl().create({
                direction: DragLineDirection.HORIZONTAL,
                end,
                start,
                dragUp: (height, evt) => {
                    this._Item.resetCursor();
                    this.setRowHeight(height);
                    this.highlightRowTitle(evt);
                    this._highlightItem.hide();
                },
            });
            this._manager.getDragLineControl().dragDown(e);
        }
        // 高亮当前行
        this.highlightRow();
    }

    setRowHeight(height: Nullable<number>) {
        const plugin = this._manager.getPlugin();
        const sheet = plugin.getContext().getWorkBook().getActiveSheet();
        if (height === null) {
            sheet.setRowHeights(this._index, 1, 5);
        } else {
            sheet.setRowHeights(this._index, 1, height! + this._currentHeight);
        }
        this.highlightRow();
    }

    highlightRow() {
        this._manager.clearSelectionControls();
        const sheet = this._manager.getPlugin().getWorkbook().getActiveSheet();
        this._manager.addControlToCurrentByRangeData(
            {
                startRow: this._index,
                startColumn: 0,
                endColumn: sheet.getColumnCount() - 1,
                endRow: this._index,
            },
            {
                row: this._index,
                column: 0,
            }
        );
    }

    highlightRowTitle(e: IPointerEvent | IMouseEvent) {
        const main = this._manager.getMainComponent();
        const { offsetX: evtOffsetX, offsetY: evtOffsetY } = e;
        this._startOffsetX = evtOffsetX;
        this._startOffsetY = evtOffsetY;
        const scrollXY = main.getAncestorScrollXY(this._startOffsetX, this._startOffsetY);
        // const contentRef = this._manager.getPlugin().getSheetContainerControl();
        const clientY = e.offsetY + scrollXY.y - this._leftTopHeight;
        const rowHeightAccumulation = main.getSkeleton()?.rowHeightAccumulation ?? [];

        for (let i = 0; i < rowHeightAccumulation?.length; i++) {
            if (rowHeightAccumulation[i] >= clientY) {
                this._index = i;
                break;
            }
        }
        // 当前行高
        this._currentHeight = rowHeightAccumulation[0];
        let top = this._leftTopHeight;
        if (this._index) {
            this._currentHeight = rowHeightAccumulation[this._index] - rowHeightAccumulation[this._index - 1];
            top = this._leftTopHeight + rowHeightAccumulation[this._index - 1];
        }

        this._content.transformByState({
            height: this._currentHeight - 5,
        });

        this._Item.transformByState({
            top: this._currentHeight - 5,
        });

        this._highlightItem.transformByState({
            height: this._currentHeight,
            top,
        });

        this._highlightItem.show();
    }

    // 拖拽图标
    private _initialize() {
        this._highlightItem.onPointerEnterObserver.add((evt: IPointerEvent | IMouseEvent) => {
            this._highlightItem.show();
        });
        this._highlightItem.onPointerLeaveObserver.add((evt: IPointerEvent | IMouseEvent) => {
            this._highlightItem.hide();
        });
        this._highlightItem.onPointerDownObserver.add(() => {
            this.highlightRow();
        });
        this._Item.onPointerEnterObserver.add((evt: IPointerEvent | IMouseEvent, eventState: EventState) => {
            eventState.isStopPropagation = true;
            this._Item.setCursor(CURSOR_TYPE.ROW_RESIZE);
            this._highlightItem.hide();
        });
        this._Item.onPointerLeaveObserver.add((evt: IPointerEvent | IMouseEvent) => {
            this._Item.resetCursor();
        });
        this._Item.onPointerDownObserver.add((evt: IPointerEvent | IMouseEvent, eventState: EventState) => {
            eventState.isStopPropagation = true;
            this.pointerDown(evt);
        });
    }
}
