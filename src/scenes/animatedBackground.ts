// CLASS TO HANDLE ANIMATED BACKGROUND

// AnimatedBackground class extends Phaser.Scene class
export class AnimatedBackground extends Phaser.Scene {

    // constructor
    constructor() {
        super({
            key : 'AnimatedBackground'
        });
    }

    // method to be executed when the scene is created
    create() : void {
        
        // place a big tilesprite
        const background : Phaser.GameObjects.TileSprite = this.add.tileSprite(0, 0, this.game.config.width as number, this.game.config.height as number, 'background');
        background.setOrigin(0);
            
        // add a tween counter to scroll background
        this.tweens.addCounter({
            from        : 0,            // initial value
            to          : 256,          // final value
            duration    : 15000,        // tween duration, in milliseconds
            repeat      : -1,           // repeat the tween forever
            onUpdate    : tween => {    // callback function to be executed at each update

                // move tile position to fake a scrolling movement
                background.setTilePosition(tween.getValue(), -tween.getValue());    
            }
        })    
    }
}