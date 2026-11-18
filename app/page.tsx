"use client";

import { useState } from "react";
import XIcon from "./component/XIcon";
import OIcon from "./component/OIcon";
import PlayerIcon from "./component/PlayerIcon";
import ResetIcon from "./component/ResetIcon";
import TrophyIcon from "./component/TrophyIcon";
import MainViewModel, { Player } from "./viewmodel/MainViewModel";

export default function Home() {
  const [vm] = useState(() => new MainViewModel());

  // 2. Helper state to tell React when the ViewModel has updated
  const [, setTick] = useState(0);
  const syncUI = () => setTick((t) => t + 1);

  // 3. Delegate actions to the ViewModel and sync UI
  const handleCellClick = (index: number) => {
    vm.playMove(index);
    syncUI();
  };

  const resetBoard = () => {
    vm.resetBoard();
    syncUI();
  };

  const resetAll = () => {
    vm.resetAll();
    syncUI();
  };

  const isXNext = vm.currentTurn === Player.X;
  const winner = vm.playerWin;
  const isDraw = vm.isDraw;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl font-bold tracking-tight">Tic-Tac-Toe</h1>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            2 Players
          </span>
        </div>

        {/* Two Players & X/O Turn Indicator */}
        <div className="grid w-full grid-cols-2 gap-3">
          {/* Player 1 (X) */}
          <div
            className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all ${
              isXNext && !winner && !isDraw
                ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/30"
                : "border-zinc-200 bg-zinc-50/50 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <PlayerIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Player 1
                </p>
                <p className="text-sm font-semibold">
                  {isXNext && !winner && !isDraw ? "Your Turn" : "Waiting"}
                </p>
              </div>
            </div>
            <XIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Player 2 (O) */}
          <div
            className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all ${
              !isXNext && !winner && !isDraw
                ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20 dark:border-rose-500 dark:bg-rose-950/30"
                : "border-zinc-200 bg-zinc-50/50 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <PlayerIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Player 2
                </p>
                <p className="text-sm font-semibold">
                  {!isXNext && !winner && !isDraw ? "Your Turn" : "Waiting"}
                </p>
              </div>
            </div>
            <OIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
        </div>

        {/* Status Banner */}
        <div className="flex h-9 w-full items-center justify-center rounded-xl bg-zinc-100 px-4 text-sm font-medium dark:bg-zinc-900">
          {winner ? (
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <TrophyIcon className="h-4 w-4" />
              Player {winner === Player.X ? "1 (X)" : "2 (O)"} Wins!
            </span>
          ) : isDraw ? (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Match Drawn!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
              Current Move:
              <strong
                className={
                  isXNext
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-rose-600 dark:text-rose-400"
                }
              >
                {isXNext ? "X" : "O"}
              </strong>
            </span>
          )}
        </div>

        {/* 3x3 Game Board */}
        <div className="grid w-full grid-cols-3 gap-3">
          {vm.board.map((cell, index) => {
            const isWinningCell = vm.winningLine.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={Boolean(cell || winner || isDraw)}
                aria-label={`Board cell ${index + 1}`}
                className={`flex aspect-square items-center justify-center rounded-2xl border text-3xl font-bold transition-all ${
                  isWinningCell
                    ? "border-emerald-500 bg-emerald-500/15 scale-[1.02]"
                    : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
                } disabled:cursor-default`}
              >
                {cell === Player.X && (
                  <XIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                )}
                {cell === Player.O && (
                  <OIcon className="h-12 w-12 text-rose-600 dark:text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Score Standing */}
        <div className="grid w-full grid-cols-3 gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="rounded-xl bg-white p-2 shadow-2xs dark:bg-zinc-950">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Player 1 (X)
            </p>
            <p className="mt-0.5 text-xl font-bold">{vm.scores[Player.X]}</p>
          </div>
          <div className="rounded-xl bg-white p-2 shadow-2xs dark:bg-zinc-950">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Draws
            </p>
            <p className="mt-0.5 text-xl font-bold">{vm.scores.draws}</p>
          </div>
          <div className="rounded-xl bg-white p-2 shadow-2xs dark:bg-zinc-950">
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              Player 2 (O)
            </p>
            <p className="mt-0.5 text-xl font-bold">{vm.scores[Player.O]}</p>
          </div>
        </div>

        {/* Reset Actions */}
        <div className="flex w-full items-stretch gap-3">
          {/* Primary Big Button for Next Game */}
          <button
            onClick={resetBoard}
            className="flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next Game
          </button>

          <button
            onClick={resetAll}
            className="flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            <ResetIcon className="h-4 w-4 mr-1.5" />
            Reset Game
          </button>
        </div>
      </main>
    </div>
  );
}
