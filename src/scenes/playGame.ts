// THE GAME ITSELF

// modules to import
import { Levels }                       from '../levels';       // game levels
import { GameOptions }                  from '../gameOptions';  // game options
import { GameBoard, TileType, Block }   from '../gameBoard';    // game board class

// enum with all sounds to play
enum SoundToPlay {
    SHOOT,  // when the player shoots
    HOLE    // when the ball is in hole    
}

// enum with all sprite layers
enum SpriteLayer {
    BACKGROUND,     // layer where to place background sprites (grass and walls)
    STATIC_ACTORS,  // layer where to place static sprites (hole and special walls)
    MOVING_ACTORS   // layer where to place dynamic sprites (ball and crates)
}

// enum with all tile frames
enum TileFrame {
    WALL,           // wall frame
    DARK_GRASS,     // dark grass frame
    LIGHT_GRASS,    // light grass frame
    CRATE,          // crate frame
    BLOCK_ON,       // block on frame
    BLOCK_OFF,      // block off frame
    BALL,           // ball frame
    HOLE            // hole frame
}

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Phaser.Scene {
   
    constructor() {
        super('PlayGame');
    }

    board               : GameBoard;                        // the game board
    golfTilesGroup      : Phaser.GameObjects.Group;         // group with all tiles
    levelText           : Phaser.GameObjects.BitmapText;    // text to display level and score
    gameSounds          : Phaser.Sound.BaseSound[];         // sounds to be played in game 
    
    // method to be executed when the scene is created
    create() : void {

         // set some global data
         this.data.set({
            level       : 0,    // current level
            moves       : 0,    // amount of moves, the aim is to beat the game in as few moves as possible  
            canRestart  : false // boolean flag to check if player can restart a level
        });

        // add 101 games challenge button, make it interactive and go to proper url if clicked
        const gameChallengeButton : Phaser.GameObjects.Sprite = this.add.sprite(this.game.config.width as number / 2 + 150, this.game.config.height as number - 25, '101').setInteractive();
        gameChallengeButton.setOrigin(0.5, 1);
        gameChallengeButton.on('pointerup', () => {
            window.location.assign('https://www.101gameschallenge.com');
        });
        
        // add logo button, make it interactive and go to proper url if clicked
        const logoButton : Phaser.GameObjects.Sprite = this.add.sprite(this.game.config.width as number / 2 - 150, this.game.config.height as number - 25, 'logo').setInteractive();
        logoButton.setOrigin(0.5, 1);
        logoButton.on('pointerup', () => {
            window.location.assign('https://www.emanueleferonato.com');
        });
        
        // add game sounds
        this.gameSounds = [this.sound.add('shoot'), this.sound.add('hole')];
        
        // add golf tiles group
        this.golfTilesGroup = this.add.group();

        // create a new game board
        this.board = new GameBoard();
       
        // check for keyboard input
        const keyboard : Phaser.Input.Keyboard.KeyboardPlugin = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin; 
        keyboard.on('keydown', (event : any) => {
            switch (event.code) {
                
                // move up
                case 'KeyW' :
                case 'ArrowUp' :
                    this.move(-1, 0);
                    break;

                // move down
                case 'KeyS' :
                case 'ArrowDown' :
                    this.move(1, 0);
                    break;

                // move left
                case 'KeyA' :
                case 'ArrowLeft' :
                    this.move(0, -1);
                    break;

                // move right
                case 'KeyD' :
                case 'ArrowRight' :
                    this.move(0, 1);
                    break;

                // restart level
                case 'KeyR' :

                    // can the player restart the level?
                    if (this.data.get('canRestart')) {

                        // player can no longer restart a level (it's already restarting!)
                        this.data.set('canRestart', false);

                        // stop all tweens
                        this.tweens.killAll();

                        // ball can't move
                        this.board.ball.canMove = false;

                        // add a tween to make all tiles disappear
                        this.tweens.add({
                            targets     : this.golfTilesGroup.getChildren(),
                            scale       : 0,
                            duration    : 500,
                            onComplete  : () => {

                                // kill and hide all golfTilesGroup tiles
                                this.golfTilesGroup.getChildren().forEach((child : Phaser.GameObjects.GameObject) => {
                                    this.golfTilesGroup.killAndHide(child);
                                });

                                // call buildLevel method to restart
                                this.buildLevel(this.data.get('level'));    
                            }  
                        });
                    }
                    break;
            }
        });

        // call buildLevel method to build and display the level
        this.buildLevel(this.data.get('level'));  

        // add sprite to display game controls
        this.add.sprite(0, this.game.config.height as number - 20, 'info').setOrigin(0, 1);

        // add sprite to display game name
        this.add.sprite(this.game.config.width as number / 2, 0, 'title').setOrigin(0.5, 0);

        // add bitmap text to show level and moves
        this.levelText = this.add.bitmapText(this.game.config.width as number / 2, 120, 'font', '').setOrigin(0.5, 1);

        // call updateLevelText to update level information
        this.updateLevelText();
    }

    // method to build the level
    // level : level number
    buildLevel(level : number) : void {
       
        // load level
        this.board.loadLevel(Levels[level]);

        // get level width and height in pixels
        const levelWidth : number = this.board.getColumns() * GameOptions.tileSize;
        const levelHeight : number = this.board.getRows() * GameOptions.tileSize;

        // calculate horizontal and vertical offset to center the level in the canvas
        const deltaX : number = (this.game.config.width as number - levelWidth + GameOptions.tileSize) / 2;
        const deltaY : number = (this.game.config.height as number - levelHeight + GameOptions.tileSize) / 2;

        // loop through all array
        for (let i : number = 0; i < this.board.getRows(); i ++) { 
            for (let j : number = 0; j < this.board.getColumns(); j ++) {

                // calculate tile position
                const posX : number = deltaX + j * GameOptions.tileSize;
                const posY : number = deltaY + i * GameOptions.tileSize; 
                switch (this.board.getValueAt(i, j)) {

                    // wall
                    case TileType.WALL :
                        this.addTile(posX, posY, TileFrame.WALL, SpriteLayer.BACKGROUND);                       
                        break;
                    
                    // grass
                    case TileType.GRASS :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, SpriteLayer.BACKGROUND);
                        break;

                    // ball
                    case TileType.BALL :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, SpriteLayer.BACKGROUND);
                        this.board.ball.data = this.addTile(posX, posY, TileFrame.BALL, SpriteLayer.MOVING_ACTORS);
                        break;

                    // hole
                    case TileType.HOLE :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, SpriteLayer.BACKGROUND);
                        this.addTile(posX, posY, TileFrame.HOLE, SpriteLayer.STATIC_ACTORS);   
                        break;

                    // crate
                    case TileType.CRATE :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, 0);
                        this.board.crates[this.board.tiles[i][j].crateIndex].data = this.addTile(posX, posY, TileFrame.CRATE, SpriteLayer.MOVING_ACTORS);
                        break;

                    // block turned off
                    case TileType.BLOCK_OFF :
                        this.board.blocks[this.board.tiles[i][j].blockIndex].data = this.addTile(posX, posY, TileFrame.BLOCK_OFF, SpriteLayer.STATIC_ACTORS);
                        break;

                    // block turned on
                    case TileType.BLOCK_ON :
                        this.board.blocks[this.board.tiles[i][j].blockIndex].data = this.addTile(posX, posY, TileFrame.BLOCK_ON, SpriteLayer.STATIC_ACTORS);
                        break;                       
                }
            }
        }
        
        // tween to make all tiles appear
        this.tweens.add({
            targets     : this.golfTilesGroup.getChildren(),
            scale       : 1,
            duration    : 500,
            onComplete  : () => {
                this.board.ball.canMove = true;
                this.data.set('canRestart', true);
            }    
        });        
    }

    // method to update level text showing level number and amount of moves
    updateLevelText() : void {
        this.levelText.setText('LEVEL: ' + (this.data.get('level') + 1) + '    MOVES: ' + this.data.get('moves'));
    }

    // method to add a tile
    // x : x position
    // y : y position
    // frame : frame number
    // depth : z-index depth
    addTile(x : number, y : number, frame : number, depth : number) : Phaser.GameObjects.Sprite {

        // just returns a sprite with all properties properly set
        return this.golfTilesGroup.get(x, y, 'tiles').setFrame(frame).setActive(true).setScale(0).setVisible(true).setDepth(depth);    
    }

    // method to play a sound effect
    // fx : the sound effect to be played
    playSound(sfx : Phaser.Sound.BaseSound) : void {
        
        // play a sound effect ad a random rate to simulate we have different sounds
        sfx.play({
            rate : Phaser.Math.FloatBetween(0.9, 1.1)
        });
    }

    // method to make player move
    // deltaRow : delta row movement (vertical)
    // deltaColumn : delta column movement (horizontal)
    move(deltaRow : number, deltaColumn : number) : void {
        
        // if we can't move, there is no point in continuing 
        if (!this.board.ball.canMove) {
            return;
        }

        // since now we are moving, at the moment we can't move anymore
        this.board.ball.canMove = false;

        // let's make the class perform the move
        const movement : any = this.board.move(deltaRow, deltaColumn);
        
        // if there is something to move, for example the ball or a crate...
        if (movement.ballMovement.delta.row != 0 || movement.ballMovement.delta.column != 0 || movement.crateMovement.delta.row != 0 || movement.crateMovement.delta.column != 0) {
            
            // increase the number of moves if we aren't in the last level (it's something like a congratz screen)
            if (this.data.get('level') < Levels.length - 1) {
                this.data.inc('moves');
            }

            // play the proper sound
            this.playSound(this.gameSounds[SoundToPlay.SHOOT]);

            // update level text
            this.updateLevelText();

            // change blocks texture
            this.board.blocks.forEach((block : Block) => {
                block.data.setFrame(block.active ? 4 : 5);
            })
        }

        // move the ball if needed, otherwise move the crate
        if (movement.ballMovement.delta.row != 0 || movement.ballMovement.delta.column != 0) {
            this.moveBall(movement);   
        }
        else {
            this.moveCrate(movement.crateMovement);
        }
    }

    // method to move the ball
    // movement : object with movement information
    moveBall(movement : any) : void {

        // tween the ball towards its final position
        this.tweens.add({
            targets     : this.board.ball.data,
            x           : this.board.ball.data.x + GameOptions.tileSize * movement.ballMovement.delta.column,
            y           : this.board.ball.data.y + GameOptions.tileSize * movement.ballMovement.delta.row,
            duration    : GameOptions.ballSpeed * (Math.abs(movement.ballMovement.delta.row) + Math.abs(movement.ballMovement.delta.column)),
            onComplete  : () => {

                // is the ball in hole?
                if (this.board.ball.isInHole) {

                    // can't restart at this time (you just solved the level!)
                    this.data.set('canRestart', false);

                    // play proper sound
                    this.playSound(this.gameSounds[SoundToPlay.HOLE]);

                    // tween to make the ball shrink
                    this.tweens.add({
                        targets     : this.board.ball.data,
                        scale       : 0,
                        duration    : 500,
                        onComplete  : () => {

                            // tween to make al tiles shrink
                            this.tweens.add({
                                targets     : this.golfTilesGroup.getChildren(),
                                scale       : 0,
                                duration    : 500,
                                onComplete  : () => {
                                    // kill all group members
                                    this.golfTilesGroup.getChildren().forEach((child : Phaser.GameObjects.GameObject) => {
                                        this.golfTilesGroup.killAndHide(child);
                                    });

                                    // increase level number
                                    this.data.inc('level');

                                    // update level text
                                    this.updateLevelText();

                                    // build the new level
                                    this.buildLevel(this.data.get('level'));    
                                }  
                            });
                        }
                    });
                }
                // if the ball is not in hole, try to move the crate
                else {
                    this.moveCrate(movement.crateMovement);
                }
            } 
        }) 
    }

    // method to move the crate
    // movement : object with movement information
    moveCrate(movement : any) : void {

        // if the crate moves horizontally or vertically...
        if (movement.delta.row != 0 || movement.delta.column != 0) {

            // get the sprite
            const sprite : Phaser.GameObjects.Sprite = this.board.crates[this.board.tiles[movement.to.row][movement.to.column].crateIndex].data;
            
            // tween the sprite to its destination
            this.tweens.add({
                targets : sprite,
                x           : sprite.x + GameOptions.tileSize * movement.delta.column,
                y           : sprite.y + GameOptions.tileSize * movement.delta.row,
                duration    : GameOptions.ballSpeed * (Math.abs(movement.delta.row) + Math.abs(movement.delta.column)),
                onComplete  : () => {

                    // ball can move again
                    this.board.ball.canMove = true;
                }
            })
        }
        else {

            // ball can move again
            this.board.ball.canMove = true;    
        }
    }
}