import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";
import promoCardReducer from "./common-slice/promo-card-slice";
import wishlistReducer from "./shop/wishlist-slice";
import sideBannerReducer from "./common-slice/side-banner-slice";
import categoriesReducer from "./common-slice/categories-slice"; // Yeni
import homeSectionsReducer from "./common-slice/home-sections-slice"; // Yeni
import brandsReducer from "./common-slice/brands-slice";
import adminStatsReducer from "./admin/statsSlice";
import adminCouponReducer from "./admin/coupon-slice";
import maintenanceReducer from "./common-slice/maintenance-slice";
import authorizationReducer from "./admin/authorization-slice";
import campaignCouponsReducer from "./common-slice/coupons-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    commonFeature: commonFeatureSlice,
    promoCards: promoCardReducer,
    shopWishlist: wishlistReducer,
    sideBanners: sideBannerReducer,
    categories: categoriesReducer,
    homeSections: homeSectionsReducer,
    brands: brandsReducer,
    adminStats: adminStatsReducer,
    adminCoupons: adminCouponReducer,
    maintenance: maintenanceReducer,
    adminAuthorization: authorizationReducer,
    campaignCoupons: campaignCouponsReducer,
  },
});

export default store;
