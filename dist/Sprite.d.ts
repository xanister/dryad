export interface Animation {
    name?: string;
    xOffset?: number;
    yOffset?: number;
    frameSpeed?: number;
    frameCount?: number;
    frameHeight?: number;
    frameWidth?: number;
    noloop?: boolean;
    image: string;
    scale?: number;
}
export interface SpriteOptions {
    id?: number;
    animations?: Animation[];
    name?: string;
    width?: number;
    height?: number;
    opacity?: number;
}
export declare class Sprite {
    static idCounter: number;
    static images: {
        [filename: string]: HTMLImageElement;
    };
    static imagesRoot: string;
    static addImages(filenames: string[], imagesRoot?: string): Promise<{}[]>;
    id: number;
    name: string;
    width: number;
    height: number;
    animations: Animation[];
    animation: number;
    frame: number;
    frameSpeedScale: number;
    opacity: number;
    constructor(options?: SpriteOptions);
    autosize(): void;
    render(context: CanvasRenderingContext2D, x?: number, y?: number, viewWidth?: number, viewHeight?: number): void;
    run(): void;
    updateFrame(): void;
}
