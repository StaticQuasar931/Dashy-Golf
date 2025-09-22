// CLASS TO BOOT THE GAME

// Boot class extends Phaser.Scene class
export class Boot extends Phaser.Scene {
    
    // constructor
    constructor() {
        super('Boot');
    }

    // method to be executed when the scene preloads
    preload() : void {
        
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
    }

    // method to be executed when the scene is created
    create() : void {

        // start Preloader scene
        this.scene.start('PreloadAssets');
    }
}
