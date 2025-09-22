// CLASS TO PRELOAD ASSETS

// modules to import
import { GameOptions } from "../gameOptions";

// PreloadAssets class extends Phaser.Scene class
export class PreloadAssets extends Phaser.Scene {
  
    // constructor    
    constructor() {
        super({
            key : 'PreloadAssets'
        });
    }
    
     // method to be executed when the scene is initialized
     init() : void {
        
        // loading bar, starts with a width of just one pixel
        const barX : number = (this.game.config.width as number - GameOptions.preloadBar.size.width) / 2;
        const barY : number = (this.game.config.height as number - GameOptions.preloadBar.size.height) / 2;        
        const bar : Phaser.GameObjects.Rectangle = this.add.rectangle(barX, barY, 1, GameOptions.preloadBar.size.height, GameOptions.preloadBar.color.fill);
        bar.setOrigin(0);        

        // loading bar container, placed on top of the bar
        this.add.rectangle(barX, barY, GameOptions.preloadBar.size.width, GameOptions.preloadBar.size.height).setStrokeStyle(GameOptions.preloadBar.size.border, GameOptions.preloadBar.color.container).setOrigin(0);        
        
        // as loading progresses, loading bar is resized accordingly
        this.load.on('progress', (progress : number) => {
            bar.width = GameOptions.preloadBar.size.width * progress;
        });
    }
  
    // method to be called during class preloading
    preload() : void {
 
        // load images
        this.load.image('logo', 'assets/sprites/logo.png');                                 // my logo
        this.load.image('101', 'assets/sprites/101.png');                                   // 101 games challenge's logo
        this.load.image('background', 'assets/sprites/background.png');                     // game background
        this.load.image('info', 'assets/sprites/info.png');                                 // info graphics
        this.load.image('title', 'assets/sprites/title.png');                               // game title
        
        // load sprite sheets
        this.load.spritesheet('tiles', 'assets/sprites/tiles.png', {                        // game tiles
            frameWidth  : GameOptions.tileSize,
            frameHeight : GameOptions.tileSize
        });
       
        // load bitmap fonts
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');     // bitmap font to display score

        // load audio files
        this.load.audio('shoot', ['assets/sounds/shoot.mp3', 'assets/bounce/shoot.ogg']);   // shoot sound effect
        this.load.audio('hole', ['assets/sounds/hole.mp3', 'assets/bounce/hole.ogg']);      // ball in hole sound effect
    }
  
    // method to be executed when the scene is created
    create() : void {

        // start PlayGame scene
        this.scene.start('MainGame');
    }
}