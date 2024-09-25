const X = 1;
const O = 2;

class Board
{
    constructor()
    {
        this.slots = new Array(9).fill(0);
        this.moveList = [];
        this.ply = 0;
        this._isOver = false;
        this.score = 0;
        this.isclone = false;
    }
    
    get isX() {return this.ply % 2 == 0};
    get isO() {return !this.isX;}
    get isOver()
    {
        return this._isOver;
    }
    get winnerClass()
    {
        return isOver ? (isX ? CIRCLE_CLASS : X_CLASS) : "";
    }

    reset()
    {
        this.slots = new Array(9).fill(0);
        this.moveList = [];
        this.ply = 0;
        this._isOver = false;
        this.score = 0;
        this.isclone = false;
    }

    clone()
    {
        let cloned = new Board();
        cloned.slots = [...this.slots];
        cloned.moveList = [...this.moveList];
        cloned.ply = this.ply;
        cloned.score = this.score;
        cloned._isOver = this._isOver;
        cloned.isclone = true;
        return cloned;
    }

    get(x = 0)
    {
        return this.slots[x];
    }

    makeMove(x = 0)
    {
        if(this.isOver)
            return;

        this.slots[x] = this.ply % 2 == 0 ? X : O;
        this.moveList.push(x);
        this.ply++;
        this._isOver = this.cacheIsOver();
        this.score = this.totalScore();
    }

    unmakeLastMove()
    {
        let lastCoord = this.moveList.pop();
        this.slots[lastCoord] = 0;
        this.ply--;
        this._isOver = false;
    }

    scoreCombination(list = [])
    {
        let total = 0;
        for (let index = 0; index < 3; index++) 
        {
            let color = this.get(list[index]);
            total += color == X ? 1 : color == O ? -1 : 0;
        }
        return total;
    }

    cacheIsOver()
    {
        let over = false;
        WINNING_COMBINATIONS.forEach(list => 
        {
            if(!over)
            {
                let listScore = this.scoreCombination(list);
                over = listScore >= 3 || listScore <= -3;
            }
        });
        return over;
    }

    totalScore()
    {
        let totalScore = 0;
        WINNING_COMBINATIONS.forEach(list => 
        {
            let score = this.scoreCombination(list);
            totalScore += score;
            if(score >= 3 || score <= -3)
            {
                totalScore += score * 10;
            }
        });
        return totalScore;
    }

    moves()
    {
        let list = [];
        for (let index = 0; index < 9; index++) 
        {
            if(this.slots[index] == 0)
                list.push(index);
        }
        return list;
    }
}

class BoardSearch
{
    static getBestMove(board)
    {
        let perspective = board.isX ? 1 : -1;
        let allMoves = board.moves();
        let winningCombination = 
        {
            move: allMoves[0],
            score: board.isX ? -Infinity : Infinity
        };

        let alpha = -Infinity;
        let beta = Infinity;
        let depth = 8;
        for (let index = 0; index < allMoves.length; index++) 
        {
            board.makeMove(allMoves[index]);
            let moveScore = this.evaluate(board, depth, alpha, beta);
            board.unmakeLastMove();
            let isGreater = moveScore >= winningCombination.score;
            let isLesser = moveScore <= winningCombination.score;
            if((isGreater && board.isX) || (isLesser && board.isO))
            {
                winningCombination = { move: allMoves[index], score: moveScore};
            }
        }

        return winningCombination.move;
    }

    static evaluate(board, depth = 0, alpha = 0, beta = 0)
    {
        if(depth <= 0 || board.isOver || board.ply >= 9)
        {
            let perspective = board.isX ? 1 : -1;
            return perspective * board.totalScore();
        }

        let allMoves = board.moves();
        let maxEval = -Infinity;
        for (let index = 0; index < allMoves.length; index++) 
        {
            board.makeMove(allMoves[index]);
            let moveScore = -this.evaluate(board, depth - 1, -beta, -alpha);
            board.unmakeLastMove();

            maxEval = Math.max(maxEval, moveScore);
            alpha = Math.max(alpha, moveScore);

            if(alpha >= beta)
            {
                return beta;
            }
        }

        return alpha;
    }

}