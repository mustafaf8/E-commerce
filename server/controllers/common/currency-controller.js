const { getExchangeRate } = require("../../utils/currencyConverter");

const getCurrentRate = async (req, res) => {
    try {
        const rate = await getExchangeRate();
        res.status(200).json({
            success: true,
            data: {
                rate: rate,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Döviz kuru alınırken bir hata oluştu.",
        });
    }
};

module.exports = {
    getCurrentRate,
}; 