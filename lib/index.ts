import { TurnStateManager } from './src/TurnStateManager';

function main() {
    const turnTickCallback = (time: any) => {
        if (time.timerCount && time.timerCount % 500 === 0) {
            console.log(`turnTickCallback - ${time.timerCount / 1000}s`);
        }
    }
    const totalTickCallback = (time: any) => {
        if (time.timerCount && time.timerCount % 500 === 0) {
            console.log(`totalTickCallback - ${time.timerCount / 1000}s`);
        }
    }

    const manager = TurnStateManager.getInstance();
    manager.setGame(1, {
        turnIndex: 0,
        turnNumber: 3,
        turnTime: 3000,
        // totalTime: 30000,
        turnTimeTickCallback: turnTickCallback,
        totalTimeTickCallback: totalTickCallback,
        auto: true,
        loop: false
    });
    const game = manager.getGameFromId(1);
    game.start();
    // manager.clearGames();
    console.log(manager.getGamesAll());
}
main();

export default TurnStateManager;
