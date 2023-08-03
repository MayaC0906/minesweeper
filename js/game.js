'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'
const NEIGHBOR = 'neighbor'
var gFlagCount = 0
var gBoard
var gminesIdx


var gLevel = { SIZE: 4, MINES: 2 }

var gGame = {
    isOn: true, shownCount: 0,
    markedCount: 0, secsPassed: 0
}


function onInIt() {
    const elGameOver = document.querySelector ('.lose')
    elGameOver.classList.add('hide')
    const elWinGame = document.querySelector ('.win')
    elWinGame.classList.add('hide')

    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    console.table(gBoard)
    renderBoard(gBoard)
}

function buildBoard() {

    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])

        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                location: { i, j },
                type: EMPTY,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }


        }

    }
    gminesIdx = []
    for (var k = 0; k < gLevel.MINES; k++) {
        var mineLocation = {
            i: getRandomInt(0, gLevel.SIZE - 1),
            j: getRandomInt(0, gLevel.SIZE - 1)
        }
        gminesIdx.push(mineLocation)
    }
    console.log(gminesIdx);

    for (var l = 0; l < gminesIdx.length; l++) {
        board[gminesIdx[l].i][gminesIdx[l].j].type = MINE
        board[gminesIdx[l].i][gminesIdx[l].j].isMine = true
    }

    return board

}

function setMinesNegsCount(board) {
    const boardIdxs = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            boardIdxs.push({ i, j })
        }
    }

    for (var k = 0; k < boardIdxs.length; k++) {
        var rowIdx = boardIdxs[k].i
        var colIdx = boardIdxs[k].j
        // console.log(rowIdx);
        // console.log(colIdx);
        var minesCount = 0
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            // console.log(i);
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= board.length) continue
                if (i === rowIdx && j === colIdx) continue
                if (board[i][j].type === MINE) minesCount++
                // console.log(minesAcount);
            }
        }
        board[rowIdx][colIdx].minesAroundCount = minesCount
        if (board[rowIdx][colIdx].type !== MINE
            && minesCount > 0) {
            board[rowIdx][colIdx].type = NEIGHBOR
        }
        minesCount = 0
    }

}

function renderBoard(board) {
    console.log(board.length);
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < board.length; j++) {
            var cellName = 'cell-' + i + '-' + j
            strHtml += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${cellName}"></td>`
        }
        strHtml += `</tr>`
    }
    console.log(strHtml);
    const elBoardGame = document.querySelector('.boardGame')
    elBoardGame.innerHTML = strHtml
}

function onCellClicked(elCell, i, j) {

    gBoard[i][j].isShown = true
    
    if (gBoard[i][j].type === NEIGHBOR) neighborChosen(i, j)

    else if (gBoard[i][j].type === MINE) mineChosen()

    else if (gBoard[i][j].type === EMPTY) {
        emptyChosen(i, j)
        openNegs(i, j)
    }


    // *************
    checkGameOver()

}


function openNegs(i, j) {
    const cellNegs = getCellNegs(i, j)
    console.log(cellNegs);
    for (var k = 0; k < cellNegs.length; k++) {
        var currCell = cellNegs[k]
        //     console.log(currCell);
        // }
        if (gBoard[currCell.i][currCell.j].type === NEIGHBOR) {
            neighborChosen(currCell.i, currCell.j)
            gBoard[currCell.i][currCell.j].isShown = true
        }
        else if (gBoard[currCell.i][currCell.j].type === EMPTY) {
            emptyChosen(currCell.i, currCell.j)
            gBoard[currCell.i][currCell.j].isShown = true
        }
    }
    checkGameOver()
}

function getCellNegs(i, j) {
    const cellNegs = []

    for (var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= gBoard.length) continue
        // console.log(i);
        for (var l = j - 1; l <= j + 1; l++) {
            if (l < 0 || l >= gBoard.length) continue
            if (k === i && l === j) continue
            cellNegs.push({ i: k, j: l })
        }
    }
    return cellNegs
}

function getClassName(i, j) {
    var className = `.cell-${i}-${j}`
    return className
}

function onCellMarked(elCell) {

}

function checkGameOver() {
    const elWinGame = document.querySelector ('.win')
    for (var i=0 ; i<gLevel.SIZE;i++) {
        for (var j=0 ; j<gLevel.SIZE;j++) {
            if (gBoard[i][j].isShown===false) return 
        }
    }
        elWinGame.classList.remove('hide')
}

function gameOver() {
    
}

function expandShown(board, elCell, i, j) {

}

function emptyChosen(i, j) {
    const cellEmptyClass = getClassName(i, j)
    console.log(cellEmptyClass);
    const elEmptyChosen = document.querySelector(`${cellEmptyClass}`)
    elEmptyChosen.classList.add('empty')
}

function neighborChosen(i, j) {
    const cellNegClass = getClassName(i, j)
    const elNegChosen = document.querySelector(cellNegClass)
    elNegChosen.innerText = gBoard[i][j].minesAroundCount
}

function mineChosen() {
    for (var k = 0; k < gminesIdx.length; k++) {
        var i = gminesIdx[k].i
        var j = gminesIdx[k].j
        var className = getClassName(i, j)
        const elBoardGame = document.querySelector(className)
        elBoardGame.innerText = MINE
    }
    const elGameOver = document.querySelector ('.lose')
    elGameOver.classList.remove('hide')
}
// { minesAroundCount: 4, isShown: false, isMine: false, isMarked: true}