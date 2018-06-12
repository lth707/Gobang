let chessArray = [];
let chessWidth = 15;
let chessHeight = 15;
let offset = 40;
const emptyColor = 0, blackColor = 1, whiteColor = 2;
const chessItemHtml = '<div class="chess-item"></div>';
const pieceHtml = '<div class="chess-item-piece"></div>';
let currentColor = 'white';
let $rootElem;
let leftToRight = [0, 1], rigthToLeft = [0, -1],
    topToBottom = [1, 0], bottomToTop = [-1, 0],
    leftTopToRightBottom = [1, 1], rightBottomToLeftTop = [-1, -1],
    leftBottomToRightTop = [-1, 1], rigthTopToLeftBottom = [1, -1];
//初始化函数
function initChess($root) {
    $root.empty()
    $rootElem = $root;
    chessArray = [];
    currentColor = 'white';
    for (let i = 0; i < chessWidth; i++) {
        let col = [];
        for (let j = 0; j < chessHeight; j++) {
            col.push(emptyColor)
            var $chessItem = $(chessItemHtml);
            $chessItem.css({
                top: j * offset,
                left: i * offset
            }).data('value', emptyColor)
                .data('col', i).data('row', j)
                .click(handleClick);
            $root.append($chessItem);
        }
        chessArray.push(col)
    }
}
//清空棋盘
function claerChess() {
    initChess($rootElem)
}
//处理棋盘点击事件
function handleClick() {
    let $this = $(this);
    if ($this.data('value') !== emptyColor) {
        layer.msg('this place has piece');
        return false;
    }
    let col = $this.data('col')
    let row = $this.data('row')
    $piece = $(pieceHtml);
    let result
    if (currentColor === 'white') {
        $piece.css('background', '#ffffff');
        chessArray[row][col] = whiteColor;
        $this.data('value', whiteColor);
        result = judgeWinner(row, col)
        currentColor = 'black'
    } else {
        $piece.css('background', '#000000');
        chessArray[row][col] = blackColor;
        $this.data('value', blackColor);
        result = judgeWinner(row, col)
        currentColor = 'white'
    }
    $this.append($piece)
    if (result) {
        setTimeout(function () {
            claerChess()
        }, 500);
    }
}

function handleDirection(beginPoint, leftSide, rightSide, topSide, bottomSide, direction) {
    let totalWhiteCount = 0;
    let totalBlackCount = 0;
    let currentRow = beginPoint[0];
    let currentCol = beginPoint[1];
    while (currentRow >= topSide && currentRow <= bottomSide && currentCol >= leftSide && currentCol <= rightSide) {
        if (currentColor == 'white') {
            if (chessArray[currentRow][currentCol] === whiteColor) {
                totalWhiteCount++;
                if (totalWhiteCount >= 5) {
                    layer.alert('白胜')
                    return true;
                }
            } else {
                totalWhiteCount = 0;
            }
        } else {
            if (chessArray[currentRow][currentCol] === blackColor) {
                totalBlackCount++;
                if (totalBlackCount >= 5) {
                    layer.alert('黑胜')
                    return true;
                }
            } else {
                totalBlackCount = 0;
            }
        }
        currentRow += direction[0];
        currentCol += direction[1];
    }
}

//判断胜负
function judgeWinner(row, col) {
    let result = false;
    result = handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, leftToRight)//左到右方向扫描
    result = result || handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, rigthToLeft)//右到左向扫描
    result = result || handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, topToBottom)//上到下方向扫描
    result = result || handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, bottomToTop)//下到上方向扫描
    result = result || handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, leftTopToRightBottom)//左上到右下方向扫描
    result = result || handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, rightBottomToLeftTop)//右下到左上方向扫描
    result = result || handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, leftBottomToRightTop)//左下到右上方向扫描
    result = result || handleDirection([row, col], 0, chessWidth - 1, 0, chessHeight - 1, rigthTopToLeftBottom)//右上到左下方向扫描
    return result
}