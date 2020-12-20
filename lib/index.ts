import { TurnStateManager } from './src/TurnStateManager';
import { EVENT } from './src/config/constants';

const turnStateManager = TurnStateManager.getInstance();

export { turnStateManager, EVENT };