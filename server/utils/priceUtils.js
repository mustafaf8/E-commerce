/**
 * Fiyatları tam sayıya yuvarlar (virgülden sonrası .00 olur).
 * @param {number} price - Orijinal TL fiyatı.
 * @returns {number} Tam sayıya yuvarlanmış fiyat.
 */
const roundToMarketingPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return price; // Sayı değilse veya NaN ise dokunma
  }

  return Math.round(price);
};

module.exports = {
  roundToMarketingPrice,
};