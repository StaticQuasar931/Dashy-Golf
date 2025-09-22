// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

export const GameOptions : any = {

    gameSize : {
        width               : 1520,     // width of the game, in pixels
        height              : 855       // height of the game, in pixels
    },
    
    gameBackgroundColor     : 0x000000, // game background color

    preloadBar : { 
        size : {
            width           : 300,      // preload bar width, in pixels
            height          : 60,       // preload bar height, in pixels
            border          : 3         // preload bar border width, in pixels
        },
        color : {
            container       : 0xffffff, // preload bar container (border) color
            fill            : 0x888888  // preload bar fill color
        }
    },

    tileSize                : 32,       // tile size, in pixels
    ballSpeed               : 30        // ball speed, in milliseconds needed to move from a tile to next one
    
}