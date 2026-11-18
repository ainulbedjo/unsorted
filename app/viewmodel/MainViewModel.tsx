export const Player = Object.freeze({
  X: "x",
  O: "o",
});

// Creates the type: "x" | "o"
export type Player = (typeof Player)[keyof typeof Player];

class MainViewModel {
  /**
   * [0,1,2]
   * [3,4,5]
   * [6,7,8]
   */
  private readonly WINNING_LINES = [
    // horizontal winning tiles
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical winning tiles
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonal winning tiles
    [0, 4, 8],
    [2, 4, 6],
  ];

  // private states
  private readonly takenTiles = new Map<number, boolean>();
  private xState: Array<number> = [];
  private oState: Array<number> = [];

  // Public states for the UI
  board: (Player | null)[] = Array(9).fill(null);
  currentTurn: Player = Player.X;
  playerWin: Player | null = null;
  winningLine: number[] = [];
  isDraw: boolean = false;
  scores = { [Player.X]: 0, [Player.O]: 0, draws: 0 };

  constructor() {
    this.resetBoard();
  }

  public resetBoard(): void {
    this.xState = [];
    this.oState = [];
    this.board = Array(9).fill(null);
    this.currentTurn = Player.X;
    this.playerWin = null;
    this.winningLine = [];
    this.isDraw = false;

    for (let i = 0; i < 9; i++) {
      this.takenTiles.set(i, false);
    }
  }

  public resetAll(): void {
    this.resetBoard();
    this.scores = { [Player.X]: 0, [Player.O]: 0, draws: 0 };
  }

  public playMove(tileIndex: number): void {
    if (
      this.takenTiles.get(tileIndex) ||
      this.playerWin !== null ||
      this.isDraw
    ) {
      return;
    }

    const activePlayer = this.currentTurn;

    if (activePlayer === Player.X) {
      this.xState.push(tileIndex);
    } else {
      this.oState.push(tileIndex);
    }

    this.board[tileIndex] = activePlayer;
    this.takenTiles.set(tileIndex, true);
    this.checkGameStatus(activePlayer);

    // Switch turns if the game is still ongoing
    if (!this.playerWin && !this.isDraw) {
      this.currentTurn = activePlayer === Player.X ? Player.O : Player.X;
    }
  }

  private checkGameStatus(player: Player): void {
    const currentPositions = player === Player.X ? this.xState : this.oState;

    if (currentPositions.length >= 3) {
      const matchedLine = this.WINNING_LINES.find((line) =>
        line.every((tile) => currentPositions.includes(tile)),
      );

      if (matchedLine) {
        this.playerWin = player;
        this.winningLine = matchedLine;
        this.scores[player] += 1;
        return;
      }
    }

    if (this.xState.length + this.oState.length === 9) {
      this.isDraw = true;
      this.scores.draws += 1;
    }
  }
}

export default MainViewModel;
