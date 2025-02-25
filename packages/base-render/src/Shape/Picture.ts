import { IShapeProps, Shape } from './Shape';

export interface IPictureProps extends IShapeProps {
    image?: HTMLImageElement;
    url?: string;
    success?: () => void;
    liX?: number;
    liY?: number;
    fail?: () => void;
    autoWidth?: boolean;
    autoHeight?: boolean;
}

export class Picture extends Shape<IPictureProps> {
    protected _props: IPictureProps;

    protected _native: HTMLImageElement;

    constructor(id: string, config: IPictureProps) {
        super(id, config);
        this._props = {
            autoWidth: false,
            autoHeight: false,
            ...config,
        };
        if (config.image) {
            this._native = config.image;
            this._init();
        } else if (config.url) {
            this._native = document.createElement('img');
            this._native.src = config.url;
            this._native.onload = () => {
                config.success?.();
                this._init();
                this.makeDirty(true);
            };
            this._native.onerror = () => {
                if (config.fail) {
                    config.fail();
                } else {
                    this._native.src =
                        'data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTMwNC4xMjggNDU2LjE5MmM0OC42NCAwIDg4LjA2NC0zOS40MjQgODguMDY0LTg4LjA2NHMtMzkuNDI0LTg4LjA2NC04OC4wNjQtODguMDY0LTg4LjA2NCAzOS40MjQtODguMDY0IDg4LjA2NCAzOS40MjQgODguMDY0IDg4LjA2NCA4OC4wNjR6bTAtMTE2LjIyNGMxNS4zNiAwIDI4LjE2IDEyLjI4OCAyOC4xNiAyOC4xNnMtMTIuMjg4IDI4LjE2LTI4LjE2IDI4LjE2LTI4LjE2LTEyLjI4OC0yOC4xNi0yOC4xNiAxMi4yODgtMjguMTYgMjguMTYtMjguMTZ6IiBmaWxsPSIjZTZlNmU2Ii8+PHBhdGggZD0iTTg4Ny4yOTYgMTU5Ljc0NEgxMzYuNzA0Qzk2Ljc2OCAxNTkuNzQ0IDY0IDE5MiA2NCAyMzIuNDQ4djU1OS4xMDRjMCAzOS45MzYgMzIuMjU2IDcyLjcwNCA3Mi43MDQgNzIuNzA0aDE5OC4xNDRMNTAwLjIyNCA2ODguNjRsLTM2LjM1Mi0yMjIuNzIgMTYyLjMwNC0xMzAuNTYtNjEuNDQgMTQzLjg3MiA5Mi42NzIgMjE0LjAxNi0xMDUuNDcyIDE3MS4wMDhoMzM1LjM2QzkyNy4yMzIgODY0LjI1NiA5NjAgODMyIDk2MCA3OTEuNTUyVjIzMi40NDhjMC0zOS45MzYtMzIuMjU2LTcyLjcwNC03Mi43MDQtNzIuNzA0em0tMTM4Ljc1MiA3MS42OHYuNTEySDg1Ny42YzE2LjM4NCAwIDMwLjIwOCAxMy4zMTIgMzAuMjA4IDMwLjIwOHYzOTkuODcyTDY3My4yOCA0MDguMDY0bDc1LjI2NC0xNzYuNjR6TTMwNC42NCA3OTIuMDY0SDE2NS44ODhjLTE2LjM4NCAwLTMwLjIwOC0xMy4zMTItMzAuMjA4LTMwLjIwOHYtOS43MjhsMTM4Ljc1Mi0xNjQuMzUyIDEwNC45NiAxMjQuNDE2LTc0Ljc1MiA3OS44NzJ6bTgxLjkyLTM1NS44NGwzNy4zNzYgMjI4Ljg2NC0uNTEyLjUxMi0xNDIuODQ4LTE2OS45ODRjLTMuMDcyLTMuNTg0LTkuMjE2LTMuNTg0LTEyLjI4OCAwTDEzNS42OCA2NTIuOFYyNjIuMTQ0YzAtMTYuMzg0IDEzLjMxMi0zMC4yMDggMzAuMjA4LTMwLjIwOGg0NzQuNjI0TDM4Ni41NiA0MzYuMjI0em01MDEuMjQ4IDMyNS42MzJjMCAxNi44OTYtMTMuMzEyIDMwLjIwOC0yOS42OTYgMzAuMjA4SDY4MC45Nmw1Ny4zNDQtOTMuMTg0LTg3LjU1Mi0yMDIuMjQgNy4xNjgtNy42OCAyMjkuODg4IDI3Mi44OTZ6IiBmaWxsPSIjZTZlNmU2Ii8+PC9zdmc+';
                    this._init();
                    this.makeDirty(true);
                }
            };
        }
    }

    static drawWith(ctx: CanvasRenderingContext2D, picture: Picture) {
        if (picture._native?.complete) {
            const { width, height } = picture;
            try {
                ctx.drawImage(picture._native, 0, 0, width, height);
            } catch (error) {
                console.error(error);
            }
        }
    }

    static create(id: string, url: string, callback?: () => void): Picture {
        return new Picture(id, { url, success: callback });
    }

    getPictureProps(): IPictureProps {
        return this._props;
    }

    protected _draw(ctx: CanvasRenderingContext2D) {
        Picture.drawWith(ctx, this);
    }

    protected _init(): void {
        if (this._props.autoWidth) {
            this.resize(this._native.width);
        }
        if (this._props.autoHeight) {
            this.resize(undefined, this._native.height);
        }
    }
}
