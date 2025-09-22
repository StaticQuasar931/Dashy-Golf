// MAIN GAME CLASS

// MainGame class extends Phaser.Scene class
export class MainGame extends Phaser.Scene {

    // constructor
    constructor() {
        super('MainGame');
    }

    // method to be executed when the scene is created
    create() : void {

        // launch two scenes simultaneously
        this.scene.launch('AnimatedBackground');
        this.scene.launch('PlayGame');
    }
}