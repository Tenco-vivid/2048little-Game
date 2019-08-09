/*新的屏幕尺寸，相对的尺寸，屏幕的宽度获取,参照物*/
//documentWidth = window.screen.availWidth;/*屏幕的宽度获取*/

documentWidth = document.documentElement.clientWidth;

gridContainerWidth = 0.92*documentWidth;/*游戏的大格子*/
cellSideLength = 0.18*documentWidth;/*小方块的边长*/
cellSpace = 0.04*documentWidth;/*每个小方块的间距*/


/*计算格子的页面位置*/
/*格子距离边框顶端的函数实现*/
function getPosTop( i, j ) {
    //return 20 + i*120;
    return cellSpace + i*(cellSpace+cellSideLength);
}

/*格子距离边框顶端的函数实现*/
function getPosLeft( i, j ) {
    //return 20 + j*120;
    return cellSpace + j*(cellSpace+cellSideLength);
}

/*不同颜色值,这个我想玩，改成我喜欢的百合动漫角色(๑′ᴗ‵๑)*/
function getNumberBackgroundColor( number ){
    switch( number ){
        case 2:return "#eed77b";break;
        case 4:return "#eed77b";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }

    return "black";
}

/*前景色 ？ */
function getNumberColor( number ) {
    if (number <= 4)
        return "#faa953";

    return  "white";
}

/*查询是否为空*/
function nospace(board) {

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0)
                return false;
        }
    }

    return true;
}

/*交互细节*/
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {/*注意j从1开始*/
            if (board[i][j] != 0){/*两种情况*/
                if (board[i][j-1] == 0 || board[i][j-1] == board[i][j]){
                    return true;
                }
            }
        }
    }

    return false;
}

function canMoveRight(board) {
    for( var i = 0 ; i < 4 ; i ++ ) {
        for (var j = 2; j >= 0 ; j--) {
            if (board[i][j] != 0){
                if (board[i][j+1] == 0 || board[i][j] == board[i][j+1]){
                    return true;
                }
            }
        }
    }

    return false;
}

function canMoveUp(board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0){
                if (board[i-1][j] == 0 || board[i][j] == board[i-1][j])
                    return true;
            }
        }
    }

    return false;
}

function canMoveDown(board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >=0; i--) {
            if (board[i][j] != 0){
                if (board[i+1][j] == 0 || board[i][j] == board[i+1][j])
                    return true
            }
        }
    }

    return false;
}

/*交互逻辑调试*/
function noBlockHorizontal(row,col1,col2,board) {
    for (var j = col1+1; j < col2; j++) {
        if (board[row][j] != 0){
            return false;
        }
    }

    return true;
}

function noBlockVertical(col,row1,row2,board) {
    for (var i = row1+1; i < row2; i++) {
        if (board[i][col] != 0){
            return false;
        }
    }

    return true;
}

/*gamevoer部分*/
function nomove(board) {
    if (canMoveLeft(board) ||
        canMoveRight(board) ||
        canMoveUp(board) ||
        canMoveDown(board)
    )
        return false;

    return true;
}


