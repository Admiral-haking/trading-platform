import { queue } from "../../../modules/coinex/utils/axios"
import { logger } from "../../../utils/logger"

export const coinexOutgoingRequests: Handler = (req, res, next) => {
    try {
        const list = queue.map(x => x.data);

        res.json(list)
    }
    catch (err) {
        logger.error(err)
    }
}