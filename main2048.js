/*游戏数据较少，放在主逻辑处*/
var board = new Array();
var score = 0;
var hasConflicted = new Array();/*是否每一个小格子已经发生了碰撞*/

/*控屏幕、触屏*/
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;



/*当整个程序加载完成时，主函数只做一个功能，开始一个新的游戏，游戏界面的部署*/
$(document).ready(function () {
    prepareForMobile();/*在移动端游戏开始之前的准备工作*/

    newgame();/*按钮也是这个函数*/
});

/*在移动端游戏开始之前的准备工作*/
function prepareForMobile() {
    if ( documentWidth>50 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('#grid-cell').css('width',cellSideLength);
    $('#grid-cell').css('height',cellSideLength);
    $('#grid-cell').css('border-radius',0.02*cellSideLength);
}


/*定义这个函数*/
function newgame() {
    init();//初始化棋盘

    //随机在两个格子生成2和4
    generateOneNumber();
    generateOneNumber();
}

/*初始化棋盘*/
function init(){
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {

            var gridCell = $('#grid-cell-'+i+"-"+j);/*$这个什么意思 ？ */
            gridCell.css('top',getPosTop( i , j ) );/*计算Top，和Left的两个函数*/
            gridCell.css('left',getPosLeft( i , j ) );
        }
    }

    /*初始化值为0*/
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;

            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();/*此函数是控制(通知)数据在前端的显式*/

    //
    score = 0;/*变动出现在叠加*/
}

/*更新棋盘函数*/
function updateBoardView() {

    $(".number-cell").remove();/*清除*/
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');

            var theNumberCell = $('#number-cell-'+i+'-'+j);/*遍历*/

            /*元素值不同，表现不同*/
            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');/*变量+.css的话应该是格文件设置css样式的操作*/
                theNumberCell.css('height','0px');
                //theNumberCell.css('top',getPosTop(i,j)+50);
                //theNumberCell.css('left',getPosLeft(i,j)+50);
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }
            else{
                //theNumberCell.css('width','100px');
                //theNumberCell.css('height','100px');
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );/*返回相应颜色的值*/
                theNumberCell.css('color',getNumberColor( board[i][j] ));/*返回相应文字的颜色*/
                theNumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] = false;
        }
    }

    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');

}

/*随机生成2和4*/
function generateOneNumber() {

    if( nospace(board) )
        return false;

    /*随机x，y一个位置*/
    var randx = parseInt(Math.floor(Math.random()*4));/*强制转换，向下取整，o`1 *4,--1,4间浮点数*/
    var randy = parseInt(Math.floor(Math.random()*4));/*强制转换，向下取整，o`1 *4,--1,4间浮点数*/
    //判断是否以及有了数字，可用否

    var times = 0;/*优化算法，提高运行速度*/
    while (times<50){
        if ( board[randx][randy] == 0 ){
            break;
        }

        //再次生成，判断可用
        randx = parseInt(Math.floor(Math.random()*4));/*强制转换，向下取整，o`1 *4,--1,4间浮点数*/
        randy = parseInt(Math.floor(Math.random()*4));/*强制转换，向下取整，o`1 *4,--1,4间浮点数*/

        times++;
    }
    //手动创建随机数
    if (times == 50){
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    /*随机一个数字*/
    var randNumber = Math.random()<0.5 ? 2 : 4;

    /*随机位置显式随机数字*/
    board[randx][randy] = randNumber;
    //通知前端显式，有动画效果函数
    showNumberWithAnimation(randx,randy,randNumber);


    return true;
}

/*键盘事件，基于玩家相应的游戏循环*/
$(document).keydown(function (event) {

    //
    switch (event.keyCode) {
        case 37://left
            /*滚动条，阻挡事件发生时默认的效果*/
            event.preventDefault();
            if (moveLeft()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
            break;
        case 38://up
            /*滚动条，阻挡事件发生时默认的效果*/
            event.preventDefault();
            if (moveUp()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
            break;
        case 39://right
            /*滚动条，阻挡事件发生时默认的效果*/
            event.preventDefault();
            if (moveRight()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
            break;
        case 40://down
            /*滚动条，阻挡事件发生时默认的效果*/
            event.preventDefault();
            if (moveDown()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
            break;
        default://default
            break;
    }
});

/*触屏事件,js中有定义，事件监听器*/
document.addEventListener('touchstart',function (event) {
   startx = event.touches[0].pageX;
   starty = event.touches[0].pageY;
});

/*触屏相应*/
document.addEventListener('touchmove',function (event) {
   event.preventDefault();
});

document.addEventListener('touchend',function (event) {
   endx = event.changedTouches[0].pageX;
   endy = event.changedTouches[0].pageY;

   /*判断移动的方向*/
    var deltax = endx - startx;
    var deltay = endy - starty;

    /*点击*/
    if (Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth)
        return;

    //x
    if (Math.abs(deltax) >= Math.abs(deltay)){/*abs(),取决对值*/

        if( deltax>0 ){
            //move right
            if (moveRight()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
        }
        else{
            //move left
            if (moveLeft()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
        }
    }
    //y
    else{
        if ( deltay>0 ){
            //move down
            if (moveDown()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
        }
        else{
            //move up
            if (moveUp()){/*判断局势是否真正移动*/
                setTimeout("generateOneNumber()",210);/*晚一点发生，添加一个新的数字*/
                setTimeout("isgameover()",300);/*判断是否结束*/
            }
        }
    }
});


/**/
function isgameover() {
    if (nospace(board) && nomove(board)){
        gameover();
    }

}

/**/
function gameover() {
    alert("This is gameover !");
}

/*交互细节moveLeft*/
function moveLeft() {

    if (!canMoveLeft( board ))/*局势情况作为参数穿进去判断*/
        return false;

    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {/*注意j从1开始*/
            if (board[i][j] != 0){/*fen情况,查找起始点*/

                /*考擦左边，j的左侧元素*/
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){/*落脚点判断，为0，and，no 障碍物*/
                        //move,有动画
                        showMoveAnimation(i,j,i,k)/*原来没有元素*/
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    /*另一种可能*/
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board ) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k)

                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //add sorce
                        score += board[i][k];
                        //通知前台变动
                        updateSorce(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    /*操作的都是board这个数据，最后需要更新 ？ */
    setTimeout("updateBoardView()",200);/*更新太快以至于动画没了，手动等待200ms*/
    return true;
}

/*交互细节moveRight*/
function moveRight(){

    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){

            if( board[i][j] != 0 ){

                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k]){
                        showMoveAnimation( i , j , i , k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //add sorce
                        score += board[i][k];
                        //通知前台变动
                        updateSorce(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

/*交互细节moveUp*/
function moveUp() {

    if (!canMoveUp(board)){
        return false;
    }

    //moveUp
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {

            if (board[i][j] != 0){
                for (var k = 0; k < i; k++) {

                    if (board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //add sorce
                        score += board[k][j];
                        //通知前台变动
                        updateSorce(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

/*交互细节moveDown*/
function moveDown() {
    if (!canMoveDown(board)){
        return false;
    }

    //moveDown
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {

            if (board[i][j] != 0){
                for (var k = 3; k > i; k--) {

                    if (board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //add sorce
                        score += board[k][j];
                        //通知前台变动
                        updateSorce(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}




