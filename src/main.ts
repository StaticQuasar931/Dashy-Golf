import 'phaser';                                                    // Phaser    
import { Boot }                 from './scenes/boot';               // Boot scene
import { PreloadAssets }        from './scenes/preloadAssets';      // PreloadAssets scene
import { AnimatedBackground }   from './scenes/animatedBackground'; // AnimatedBackground scene
import { MainGame }             from './scenes/mainGame';           // MainGame scene
import { PlayGame }             from './scenes/playGame';           // PlayGame scene
import { GameOptions }          from './gameOptions';               // game options
import './style.css';                                               // main page stylesheet

// optimal game width and height
let width : number = GameOptions.gameSize.width;
let height : number = GameOptions.gameSize.height;

// get window ratio
const windowRatio : number = window.innerWidth /  window.innerHeight;

// get default ratio
const defaultRatio : number = width / height;

// adjust width if window ratio is greater than default ratio
if (windowRatio > defaultRatio) {
    width = GameOptions.gameSize.height * windowRatio;
}

// adjust height if window ratio is smaller than default ratio
if (windowRatio < defaultRatio) {
    height = GameOptions.gameSize.width / windowRatio;
}

let configObject : Phaser.Types.Core.GameConfig = {
    scale : {
        mode        : Phaser.Scale.FIT,         // set game size to fit the entire screen
        autoCenter  : Phaser.Scale.CENTER_BOTH, // center the canvas both horizontally and vertically in the div
        parent      : 'thegame',                // parent div element
        width       : Math.round(width),        // game width, in pixels
        height      : Math.round(height)        // game height, in pixels
    },
    scene           : [
        Boot,               
        PreloadAssets,      // scene to preload all game assetsw
        MainGame,           // main game scene, used to call all game scenes
        AnimatedBackground, // scene with the animated background
        PlayGame            // the game itself
    ]
};
 
new Phaser.Game(configObject);