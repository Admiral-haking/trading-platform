import { LogicTrader } from "./logic";

let psi: any = null;
let coi: any = null;
let cpi: any = null;
let cfpi: any = null;
export class IntervalTrader extends LogicTrader {


    constructor() {
        super();
    }


    placeSignalInterval() {
        clearInterval(psi);

        psi = setInterval(() => {
            if (!this.isApiReady()) return;
            this.placeSignalsAsOrder();
        }, 1e3 * 60);
    }


    checkOrdersInterval() {
        clearInterval(coi);

        coi = setInterval(() => {
            if (!this.isApiReady()) return;
            this.checkOnOrders();
        }, 1e3 * 60);
    }

    checkPositionsInterval() {
        clearInterval(cpi);

        cpi = setInterval(() => {
            if (!this.isApiReady()) return;
            this.checkOnCurrentPositions();
        }, 1e3 * 10);
    }


    checkFinishedPositionsInterval() {
        this.updateFinishedPositions();
        clearInterval(cfpi);
        cfpi = setInterval(() => {
            if (!this.isApiReady()) return;
            this.updateFinishedPositions();
        }, 1e3 * 60);
    }
}