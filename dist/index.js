"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TurnStateManager_1 = require("./src/TurnStateManager");
function main() {
    const manager = TurnStateManager_1.TurnStateManager.getInstance();
    manager.setGame(1, {
        turnTime: 1000,
        turnIndex: 0,
        turnNumber: 10,
        auto: true,
        loop: true
    });
    const game = manager.getGameFromId(1);
    console.log(game);
    game.start();
    console.log(game.getTurnIndex());
    setTimeout(() => {
        game.emit('prev-turn');
        console.log(game.getTurnIndex());
    }, 7500);
}
main();
exports.default = TurnStateManager_1.TurnStateManager;
//# sourceMappingURL=index.js.map