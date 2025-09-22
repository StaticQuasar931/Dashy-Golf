// GAMEBOARD CLASS, IN TYPESCRIPT WITH NO DEPENDENCIES

export enum TileType {
    EMPTY,
    WALL,
    GRASS,
    BALL,
    HOLE,
    CRATE,
    BLOCK_OFF,
    BLOCK_ON
}

export class GameBoard {

    tiles   : Tile[][]; 
    blocks  : Block[];
    crates  : Crate[];
    ball    : Ball;

    constructor() {
        this.ball = new Ball();    
    }

    loadLevel(level : number[][]) {
        this.ball.canMove = false;
        this.ball.isInHole = false;
        this.blocks = [];
        this.tiles = [];
        this.crates = [];
        for (let i : number = 0; i < level.length; i ++) {
            this.tiles[i] = [];
            for (let j : number = 0; j < level[i].length; j ++) {
                this.tiles[i][j] = new Tile(level[i][j]);
                switch (level[i][j]) {
                    case TileType.WALL :
                        this.tiles[i][j].isWalkable = false;
                        break;
                    case TileType.BALL :
                        this.ball.row = i;
                        this.ball.column = j;
                        break;
                    case TileType.HOLE :
                        this.tiles[i][j].isHole = true;
                        break;
                    case TileType.CRATE :
                        this.crates.push(new Crate());
                        this.tiles[i][j].addCrate(this.crates.length - 1);
                        break;
                    case TileType.BLOCK_ON : 
                    case TileType.BLOCK_OFF :
                        const block : Block = new Block(i, j, level[i][j] == TileType.BLOCK_ON);
                        this.blocks.push(block);
                        this.tiles[i][j].setBlock(this.blocks.length - 1);
                        break;
                }
            }
        }
    }

    isValidMove(deltaRow : number, deltaColumn : number) : boolean {
        return this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].isWalkable || (this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].hasCrate && this.tiles[this.ball.row + deltaRow * 2][this.ball.column + deltaColumn * 2].isWalkable);
    }
 
    move(deltaRow : number, deltaColumn : number) : any {
        let boardMovement : any = {
            ballMovement : {
                delta : {
                    row : 0,
                    column : 0
                }
            },
            crateMovement : {
                delta : {
                    row : 0,
                    column : 0
                }
            }
        };   
        if (!this.isValidMove(deltaRow, deltaColumn)) {
            return boardMovement;
        }   
        this.blocks.forEach((block : Block) => {
            block.active = !block.active;
            this.tiles[block.row][block.column].isWalkable = !block.active;
        })
        let movement : number = 0;
        while (this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].isWalkable && !this.ball.isInHole) {
            this.ball.row += deltaRow;
            this.ball.column += deltaColumn;
            movement ++;
            if (this.tiles[this.ball.row][this.ball.column].isHole) {
                this.ball.isInHole = true;
            }
        }
        if (movement > 0) {
            boardMovement.ballMovement = {
                delta : {
                    row : movement * deltaRow,
                    column : movement * deltaColumn
                },
                from : {
                    row : this.ball.row - movement * deltaRow,
                    column : this.ball.column - movement * deltaColumn
                },
                to : {
                    row : this.ball.row,
                    column : this.ball.column
                }
            }
        }
        if (this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].hasCrate) {
            let movement : number = 0;
            let crateStartRow : number = this.ball.row + deltaRow;
            let crateStartColumn : number = this.ball.column + deltaColumn;
            while (this.tiles[crateStartRow + deltaRow][crateStartColumn + deltaColumn].isWalkable) {
                crateStartRow += deltaRow;
                crateStartColumn += deltaColumn;
                movement ++;
            }
            if (movement > 0) {
                this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].hasCrate = false;
                this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].isWalkable = true;       
                this.tiles[crateStartRow][crateStartColumn].hasCrate = true;
                this.tiles[crateStartRow][crateStartColumn].isWalkable = false;
               
                
                this.tiles[crateStartRow][crateStartColumn].crateIndex = this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].crateIndex;
                this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn].crateIndex = -1;
                
                console.log(this.tiles[crateStartRow][crateStartColumn],  this.tiles[this.ball.row + deltaRow][this.ball.column + deltaColumn])
                boardMovement.crateMovement = {
                    delta : {
                        row : movement * deltaRow,
                        column : movement * deltaColumn
                    },
                    from : {
                        row : crateStartRow - movement * deltaRow,
                        column : crateStartColumn - movement * deltaColumn
                    },
                    to : {
                        row : crateStartRow,
                        column : crateStartColumn
                    }
                }
            }
        }
        return boardMovement;
    }

    getTileAt(row : number, column : number) : Tile {
        return this.tiles[row][column];
    }

    getValueAt(row : number, column : number) : number {
        return this.tiles[row][column].value;
    }

    getRows() : number {
        return this.tiles.length;
    }

    getColumns() : number {
        return this.tiles[0].length;
    }
}

class Tile {

    value       : number;
    blockIndex  : number;
    crateIndex  : number;
    isWalkable  : boolean;
    isHole      : boolean;
    hasCrate    : boolean;

    constructor (value : number) {
        this.isWalkable = true;
        this.isHole = false;
        this.hasCrate = false;
        this.value = value;
    }

    addCrate(index : number) : void {
        this.hasCrate = true;
        this.crateIndex = index;
        this.isWalkable = false;
    }

    removeCrate() : void {
        this.hasCrate = false;
        this.isWalkable = true;
    }

    setBlock(index : number) : void {
        this.blockIndex = index;
    }
}

class Ball {

    row         : number;
    column      : number;
    data        : any;
    canMove     : boolean;
    isInHole    : boolean;

    constructor() {}
}

export class Block {

    row     : number;
    column  : number;
    active  : boolean;
    data    : any;

    constructor (row : number, column : number, active : boolean) {
        this.row = row;
        this.column = column;
        this.active = active;
    }
}

class Crate {

    data : any;

    constructor() {}
}