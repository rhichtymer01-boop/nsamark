import { Router } from 'express';

import { adminRouter } from '../modules/admin/admin.routes.js';
import { afaRouter } from '../modules/afa/afa.routes.js';
import { chatRouter } from '../modules/chats/chat.routes.js';
import { internetVendorRouter } from '../modules/internet-vendors/internetVendor.routes.js';
import { kycRouter } from '../modules/kyc/kyc.routes.js';
import { orderRouter } from '../modules/orders/order.routes.js';
import { paymentRouter } from '../modules/payments/payment.routes.js';
import { pluginRouter } from '../modules/plugins/plugin.routes.js';
import { productRouter } from '../modules/products/product.routes.js';
import { subscriptionRouter } from '../modules/subscriptions/subscription.routes.js';
import { transporterRouter } from '../modules/transporters/transporter.routes.js';
import { userRouter } from '../modules/users/user.routes.js';
import { vendorRouter } from '../modules/vendors/vendor.routes.js';
import { walletRouter } from '../modules/wallets/wallet.routes.js';
import { classifiedRouter } from '../modules/classifieds/classified.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', userRouter);
apiRouter.use('/vendors', vendorRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/transporters', transporterRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/wallet', walletRouter);
apiRouter.use('/plugins', pluginRouter);
apiRouter.use('/subscriptions', subscriptionRouter);
apiRouter.use('/kyc', kycRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/chats', chatRouter);
apiRouter.use('/internet-vendors', internetVendorRouter);
apiRouter.use('/afa', afaRouter);
apiRouter.use('/classifieds', classifiedRouter);
