/*生成随机数动画*/
function showNumberWithAnimation(i,j,randNumber) {

    var numberCell = $('#number-cell-'+i+"-"+j);

    /*啊啊啊，又掉坑里了，哭*/
    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);

    /*动画*/
    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);/*五十毫秒？*/
}

/*移动动画*/
function showMoveAnimation(fromx,fromy,tox,toy){

    /*na==拿到ID*/
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

/*sorce 前台显式变动*/
function updateSorce(score) {
    $('#score').text(score);/*果然$的作用是拿到ID么*/
}