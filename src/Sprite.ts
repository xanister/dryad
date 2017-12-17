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

export class Sprite {
    static idCounter: number = 10;
    static images: { [filename: string]: HTMLImageElement } = {};
    static imagesRoot: string;

    static addImages(filenames: string[], imagesRoot: string = Sprite.imagesRoot) {
        return Promise.all(filenames.map(filename => new Promise((resolve, reject) => {
            if (this.images[filename]) return resolve();
            this.images[filename] = new Image();
            this.images[filename].onload = resolve;
            this.images[filename].onerror = reject;
            this.images[filename].src = `${imagesRoot}/${filename}`;
        })));
    }

    id: number;
    name: string;

    width: number; // Onscreen width
    height: number; // Onscreen height

    animations: Animation[];

    animation: number;
    frame: number;
    frameSpeedScale: number;
    opacity: number;

    constructor(options: SpriteOptions = {}) {
        this.id = Sprite.idCounter++;

        Object.assign(this, options);

        // Setup required option defaults
        this.name = this.name || this.constructor.name;
        this.animation = this.animation || 0;
        this.frame = this.frame || 0;
        this.frameSpeedScale = this.frameSpeedScale || 1;
        this.opacity = this.opacity || 1;

        // Set default dimensions based upon animation 
        // and load images into cache if needed
        if (this.animations) {
            if (Sprite.images[this.animations[0].image])
                this.autosize();
            else {
                console.warn(`Image not preloaded [${this.animations[0].image}]`)

                // TODO: FIGURE OUT WHY THIS ISN'T RESOLVING
                Sprite.addImages(this.animations.map(a => a.image))
                    .then(() => this.autosize())
                    .catch(e => console.warn(`error loading images`, e));
            }
        }
    }

    autosize() {
        this.width = this.width || this.animations[0].frameWidth || Sprite.images[this.animations[0].image].width;
        this.height = this.height || this.animations[0].frameHeight || Sprite.images[this.animations[0].image].height;
    }

    render(context: CanvasRenderingContext2D, x: number = 0, y: number = 0, viewWidth?: number, viewHeight?: number): void {
        // Temp ignore unused params for compiler
        viewWidth && viewHeight;

        // Bail if no animations set
        if (!this.animations) return;

        let a = this.animation < this.animations.length ? this.animations[this.animation] : this.animations[0],
            ascale = a.scale || 1;

        // Bail if image isn't loaded or out of frame
        if (!Sprite.images[a.image] || !Sprite.images[a.image].width || this.frame >= a.frameCount) return;

        context.globalAlpha = this.opacity;
        context.drawImage(
            Sprite.images[a.image],
            !a.frameWidth ? 0 :
                ~~((a.xOffset || 0) + (~~this.frame * a.frameWidth)),
            a.yOffset || 0,
            a.frameWidth || Sprite.images[a.image].width,
            a.frameHeight || Sprite.images[a.image].height,
            ~~(x - (this.width * 0.5 * ascale)),
            ~~(y - (this.height * 0.5 * ascale)),
            ~~(this.width * ascale),
            ~~(this.height * ascale)
        );
        context.globalAlpha = 1;
    }

    run(): void {
        this.updateFrame();
    }

    updateFrame(): void {
        if (this.animations) {
            let a = this.animation < this.animations.length ? this.animations[this.animation] : this.animations[0];
            this.frame += (a.frameSpeed * this.frameSpeedScale);
            this.frame = a.noloop || this.frame < a.frameCount ? this.frame : 0;
        }
    }
}