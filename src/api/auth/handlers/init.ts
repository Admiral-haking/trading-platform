import { Users } from "../../../models/User"
import { DynamicConfigs } from "../../../utils/config"

export const initStatusHandler: Handler = async (req, res, next) => {
    try {
        const user = !!(await Users.findOne({}))
        const configs = {
            CoinexAccessId: '',
            CoinexSecretKey: '',
            deepSeekApiKey: '',
            channels: '[]',
            workingCapitalPercentage: '',
            eachTradePercentage: '',
            withdrawalDayOfWeek: '4',
            withdrawalBase: '500',
            withdrawalTakeProfitPercentage: '50',
            wallet: '',
            strategy: '',
            ...DynamicConfigs.configs
        }

        res.json({ user, configs })
    }
    catch (err) {
        next(err)
    }
}

export const initUpdateHandler: Handler = async (req, res, next) => {
    try {
        Object.keys(req.body).forEach(key => {
            DynamicConfigs.set(key, req.body[key])
        })

        const configs = {
            CoinexAccessId: '',
            CoinexSecretKey: '',
            deepSeekApiKey: '',
            telegram: '',
            channels: '[]',
            workingCapitalPercentage: '',
            eachTradePercentage: '',
            withdrawalDayOfWeek: '4',
            withdrawalBase: '500',
            withdrawalTakeProfitPercentage: '50',
            wallet: '',
            strategy: '',
            ...DynamicConfigs.configs
        }

        res.json(configs)
    }
    catch (err) {
        next(err)
    }
}