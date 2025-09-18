import { logger } from "../../utils/logger";
import { IntervalTrader } from "./interval";

class TraderModule extends IntervalTrader {

    private started = false;
    constructor() {
        super();
    }

    start() {
        if (this.started) return;
        this.started = true;
        this.placeSignalInterval();
        this.checkOrdersInterval();
        this.checkPositionsInterval();
        this.checkFinishedPositionsInterval()

        logger.info("Trader has been started!")
    }
}


export const Trader = new TraderModule();