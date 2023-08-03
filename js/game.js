'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'
const NEIGHBOR = 'neighbor'
var gFlagCount = 0
var gBoard
var gminesIdx
var gLivesLeft = 3
var gTimerInterval


var gLevel = { SIZE: 4, MINES: 2 }

var gGame = {
    isOn: true, shownCount: 0,
    markedCount: 0, secsPassed: 0
}


function onInIt() {
    resetGame()
    const elGameOver = document.querySelector('.gameOver')
    elGameOver.innerText = '😆'
    gBoard = buildBoard()
    addMinesToBoard(gBoard)
    setMinesNegsCount(gBoard)
    // console.table(gBoard)
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

    return board

}

function addMinesToBoard(board) {
    gminesIdx = []
    var boardIdxs = getAllBoardIdxs(board)

    const shuffledBoardIdx = boardIdxs.sort((a, b) => 0.5 - Math.random())
    for (var l = 0; l < gLevel.MINES; l++) {
        var currMineIdx = shuffledBoardIdx.pop()
        gminesIdx.push(currMineIdx)
        console.log(currMineIdx);
        board[currMineIdx.i][currMineIdx.j].type = MINE
        board[currMineIdx.i][currMineIdx.j].isMine = true
    }
}

function getAllBoardIdxs(board) {
    const boardIdxs = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            boardIdxs.push({ i, j })
        }
    }
    return boardIdxs
}
function setMinesNegsCount(board) {

    const boardIdxs = getAllBoardIdxs(board)

    for (var k = 0; k < boardIdxs.length; k++) {
        var rowIdx = boardIdxs[k].i
        var colIdx = boardIdxs[k].j

        var minesCount = 0
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue

            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= board.length) continue
                if (i === rowIdx && j === colIdx) continue
                if (board[i][j].type === MINE) minesCount++
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
    // console.log(board.length);
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < board.length; j++) {
            var cellName = 'cell-' + i + '-' + j
            strHtml += `<td onclick="onCellClicked(this, ${i}, ${j})"
             oncontextmenu="event.preventDefault(),
              addFlag(this,${i},${j})" class="${cellName}"></td>`
        }
        strHtml += `</tr>`
    }
    // console.log(strHtml);
    const elBoardGame = document.querySelector('.boardGame')
    elBoardGame.innerHTML = strHtml
}

function onCellClicked(elCell, i, j) {
    if (gGame.isOn === false) return
    if (gBoard[i][j].isMarked === true) return
    gBoard[i][j].isShown = true
    gGame.shownCount++
    if (gGame.shownCount === 1) timer()

    if (gBoard[i][j].type === NEIGHBOR) neighborChosen(i, j)

    else if (gBoard[i][j].type === EMPTY) {
        emptyChosen(i, j)
        openNegs(i, j)
    }

    else if (gBoard[i][j].type === MINE) {
        if (checkLivesOver() === false) {
            gGame.shownCount--
            gBoard[i][j].isShown = false
        }
        else mineChosen()
    }


    checkGameOver()

}


function openNegs(i, j) {
    const cellNegs = getCellNegs(i, j)
    // console.log(cellNegs);
    for (var k = 0; k < cellNegs.length; k++) {
        var currCell = cellNegs[k]

        // var currClass = getClassName(currCell.i, currCell.j)
        // var elCell = document.querySelector(currClass)
        // onCellMarked(elCell.i, currCell.i)
        if (gBoard[currCell.i][currCell.j].isMarked === true) {
            gBoard[currCell.i][currCell.j].isMarked = false
            gGame.markedCount--
        }

        if (gBoard[currCell.i][currCell.j].type === NEIGHBOR) {
            neighborChosen(currCell.i, currCell.j)
            gBoard[currCell.i][currCell.j].isShown = true
            gGame.shownCount++
        }
        if (gBoard[currCell.i][currCell.j].type === EMPTY) {
            emptyChosen(currCell.i, currCell.j)
            gBoard[currCell.i][currCell.j].isShown = true
            gGame.shownCount++
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

function onCellMarked(elCell, i, j) {
    if (gGame.isOn === false) return
    elCell.innerText = EMPTY
    gBoard[i][j].isMarked = false
    gGame.markedCount--
}

function checkGameOver() {
    const elWinGame = document.querySelector('.gameOver')

    if (gLevel.SIZE ** 2 === (gGame.shownCount + gGame.markedCount) &&
        gGame.markedCount === gLevel.MINES) {
        clearInterval(gTimerInterval)
        elWinGame.innerText = '😎'
        gGame.isOn = false
    }

}

// function gameOver() {
//     //   if flags than win
//     //   if bombs lose  
// }

// // function expandShown(board, elCell, i, j) {

// // }

function addFlag(elCell, i, j) {
    if (gBoard[i][j].isShown === true || gGame.isOn === false) return
    if (gBoard[i][j].isMarked === true) onCellMarked(elCell, i, j)

    else {
        elCell.innerText = FLAG
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        checkGameOver()
    }

}

function emptyChosen(i, j) {
    const cellEmptyClass = getClassName(i, j)
    // console.log(cellEmptyClass);
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
    const elGameOver = document.querySelector('.gameOver')
    elGameOver.innerText = '😓'
    clearInterval(gTimerInterval)
    gGame.isOn = false
}


function timer() {
    var startTime = Date.now()

    gTimerInterval = setInterval(() => {
        var elapsedTime = Date.now() - startTime
        document.querySelector('.clock').innerText = (
            elapsedTime / 1000
        ).toFixed(3)
    }, 37)
}

function resetGame() {
    clearInterval(gTimerInterval)
    var elColock = document.querySelector('.clock')
    elColock.innerText = '0.000'

    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLivesLeft = 3

    var elLives = document.querySelector('.lives')
    elLives.innerText = '❤️❤️❤️'

}

function setGameLevel(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    onInIt()
}

function checkLivesOver() {
    if (gLivesLeft >= 1) {
        gLivesLeft--
        var livesLeft = gLivesLeft
        const elLives = document.querySelector('.lives')
        var livesInText = ''
        for (var i = 0; i < livesLeft; i++) {
            livesInText += '❤️'
        }
        elLives.innerText = `${livesInText}`
    }
    if (livesLeft > 0) return false
    if (livesLeft === 0) return true
} 