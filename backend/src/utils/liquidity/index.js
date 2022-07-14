const LiquidityAssets = require("./LiquidityAssets")
const Obligations = require("./Obligations")
const LiquidityAssetsCurrent = require('./LiquidityAssetsCurrent')
const ObligationsCurrent = require('./ObligationsCurrent')

async function getLiquidityTable(date, currentState) {
    if(currentState) {
        const [
            liquidityAssets,
            obligations
        ] = await Promise.all([
            // new Date() is added for getting yesterday currency rate
            new LiquidityAssetsCurrent().getRows(),
            new ObligationsCurrent().getRows()
        ])
        return {
            liquidityAssets,
            obligations
        }
    }
    const [
        liquidityAssets,
        obligations
    ] = await Promise.all([
        new LiquidityAssets(date).getRows(),
        new Obligations(date).getRows()
    ])
    return {
        liquidityAssets,
        obligations
    }
}

module.exports = getLiquidityTable