let chessArray = [];
let chessWidth = 15;
let chessHeight = 15;
let offset = 40;
const emptyColor = 0, blackColor = 1, whiteColor = 2;
const chessItemHtml = '<div class="chess-item"></div>';
const pieceHtml = '<div class="chess-item-piece"></div>';
const pieceHoverHtml = '<div class="chess-item-piece hover"></div>';
let currentColor = 'white';
let currentColorMap = {
    'white': '白方',
    'black': '黑方'
}
let reverseCurrentColorMap = {
    'white': '黑方',
    'black': '白方'
}

let $rootElem;
let leftToRight = [0, 1], rigthToLeft = [0, -1],
    topToBottom = [1, 0], bottomToTop = [-1, 0],
    leftTopToRightBottom = [1, 1], rightBottomToLeftTop = [-1, -1],
    leftBottomToRightTop = [-1, 1], rigthTopToLeftBottom = [1, -1];
let history = [];//用于存储下棋的步骤，可用于悔棋
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
                .attr('col', i).attr('row', j)
                .data('col', i).data('row', j)
                .click(handleClick);
            handleHover($chessItem);
            $root.append($chessItem);
        }
        chessArray.push(col)
    }
    return {
        clearChess: clearChess,
        restoreChess: restoreChess
    }
}
// 设置当前的颜色
function setCurrentColor() {
    var $time = $('.time');
    $('.current-color').text('当前颜色为：' + currentColorMap[currentColor])
    $time.css('color', 'green');
    $time.text('60s');
    $time.data('seconds', 60)
}
$(function () {
    setCurrentColor();
    var iid;
    var handleInterval = function () {
        var $time = $('.time');
        var seconds = $time.data('seconds') == undefined ? 60 : $time.data('seconds')
        $time.text(seconds + 's')
        if (seconds < 10) {
            $time.css('color', 'red');
        } else {
            $time.css('color', 'green');
        }
        if (!seconds) {
            clearInterval(iid);
            layer.alert('时间到，' + reverseCurrentColorMap[currentColor] + '胜', function () {
                clearChess();
                $time.css('color', 'green');
                $time.text('60s');
                $time.data('seconds', 60)
                iid = setInterval(handleInterval, 1000);
                layer.closeAll();
            })
        }
        $time.data('seconds', --seconds);
    }
    iid = setInterval(handleInterval, 1000);
})
//清空棋盘
function clearChess() {
    initChess($rootElem)
    history = []
    setCurrentColor()
}
//悔棋 
function restoreChess() {
    var position = history.pop()
    var row = position[0]
    var col = position[1]
    var $div = $rootElem.find('[row=' + row + '][col=' + col + ']');
    chessArray[row][col] = emptyColor;
    $div.data('value', emptyColor);
    $div.empty();
    if (currentColor == 'white') {
        currentColor = 'black'
    } else {
        currentColor = 'white'
    }
    setCurrentColor();
}
//处理棋盘点击事件
function handleClick() {
    let $this = $(this);
    if ($this.data('value') !== emptyColor) {
        layer.msg('该位置已经放置了棋子');
        return false;
    }
    let col = $this.data('col')
    let row = $this.data('row')
    history.push([row, col])
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
    setCurrentColor();
    $this.append($piece)
    if (result) {
        setTimeout(function () {
            clearChess()
        }, 500);
    }
}

function handleHover($chessItem) {
    $chessItem.hover(function () {
        var $pieceHover = $(pieceHoverHtml)
        var $this = $(this);
        if (currentColor === 'white') {
            $pieceHover.css('background', '#ffffff');
        } else {
            $pieceHover.css('background', '#000000');
        }
        $this.append($pieceHover);
    }, function () {
        var $this = $(this);
        $this.find('.hover').remove();
    })
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
                    layer.alert(currentColorMap[currentColor] + '胜')
                    return true;
                }
            } else {
                totalWhiteCount = 0;
            }
        } else {
            if (chessArray[currentRow][currentCol] === blackColor) {
                totalBlackCount++;
                if (totalBlackCount >= 5) {
                    layer.alert(currentColorMap[currentColor] + '胜')
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