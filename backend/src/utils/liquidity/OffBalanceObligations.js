const LiquidityMainClass = require("./LiquidityMainClass")

class OffBalanceObligations extends LiquidityMainClass {
    constructor(date) {
        super(date)
    }

    async obligations_loans() { /* Обязательства по выдаче кредитов (не обеспеченные кредитными линиями) */
        /* TODO IT IS TEMPORARY RESULT */
        return new Promise(resolve => resolve({
            count: 15,
            state: 'Обязательства по выдаче кредитов (не обеспеченные кредитными линиями)',
            total: 0.00,
            nat_curr: 0.00,
            for_curr: 0.00,
            usa_dollar: 0.00,
            evro: '12.60%'
        }))
    } /* Обязательства по выдаче кредитов (не обеспеченные кредитными линиями) */

    async liquidity_ratio() { /* Коэффициент мгновенной ликвидности в сумах (UZS) (норматив: не менее 25%) */
        /* TODO IT IS TEMPORARY RESULT */
        return new Promise(resolve => resolve({
            count: 16,
            state: 'Коэффициент мгновенной ликвидности в сумах (UZS) (норматив: не менее 25%)',
            total: '112.27%',
            nat_curr: 0.00,
            for_curr: 0.00,
            usa_dollar: 0.00,
            evro: 0.00
        }))
    } /* Коэффициент мгновенной ликвидности в сумах (UZS) (норматив: не менее 25%) */

    async liquidity_coverage_ratio() { /* Коэффициент покрытия ликвидности (LCR норматив не менее 100%) на 01.05.2021 г. */
        /* TODO IT IS TEMPORARY RESULT */
        return new Promise(resolve => resolve({
            count: 17,
            state: 'Коэффициент покрытия ликвидности (LCR норматив не менее 100%) на 01.05.2021 г.',
            total: '198.20%',
            nat_curr: '242.60%',
            for_curr: '189.24%',
            usa_dollar: 0.00,
            evro: 0.00
        }))
    } /* Коэффициент покрытия ликвидности (LCR норматив не менее 100%) на 01.05.2021 г.  */

    async financing_ratio() { /* Коэффициент норматива чистой стабильной финансирования (NSFR норматив не менее 100%) на 01.05.2021 г. */
        /* TODO IT IS TEMPORARY RESULT */
        return new Promise(resolve => resolve({
            count: 18,
            state: 'Коэффициент норматива чистой стабильной финансирования (NSFR норматив не менее 100%) на 01.05.2021 г.',
            total: '115.10%',
            nat_curr: '108.18%',
            for_curr: '118.50%',
            usa_dollar: 0.00,
            evro: 0.00
        }))
    } /* Коэффициент норматива чистой стабильной финансирования (NSFR норматив не менее 100%) на 01.05.2021 г.  */

    async getRows() {
        const [
            obligationsLoans,
            liquidityRatio,
            liquidityCoverageRatio,
            financingRatio
        ] = await Promise.all([
            this.obligations_loans(),
            this.liquidity_ratio(),
            this.liquidity_coverage_ratio(),
            this.financing_ratio()
        ])

        return [
            obligationsLoans,
            liquidityRatio,
            liquidityCoverageRatio,
            financingRatio
        ]
    }
}

module.exports = OffBalanceObligations