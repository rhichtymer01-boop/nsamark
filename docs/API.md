# Nsamark API Documentation (Draft)

## Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Vendors
- `GET /api/vendors`
- `GET /api/vendors/:id`
- `GET /api/vendors/:id/dashboard`
- `POST /api/vendors`
- `PUT /api/vendors/:id`

## Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## Orders
- `POST /api/orders`
- `GET /api/orders/vendors/:vendorId`
- `GET /api/orders/transporters/:transporterId`
- `PATCH /api/orders/:orderId`
- `POST /api/orders/:orderId/assign-transporter`

## Transporters
- `GET /api/transporters`

## Payments
- `POST /api/payments/initialize`
- `POST /api/payments/paystack/webhook`

## Wallet
- `GET /api/wallet`
- `POST /api/wallet/top-up`
- `POST /api/wallet/withdraw`

## Plugins
- `GET /api/plugins`
- `POST /api/plugins`
- `PUT /api/plugins/:id`

## Subscriptions
- `GET /api/subscriptions`
- `POST /api/subscriptions`
- `PUT /api/subscriptions/:id`

## KYC
- `POST /api/kyc`
- `GET /api/kyc/me`
- `GET /api/kyc`
- `GET /api/kyc/:kycId`
- `PATCH /api/kyc/:kycId`

## Admin
- `GET /api/admin/dashboard`
- `POST /api/admin/kyc/:kycId/approve`
- `POST /api/admin/kyc/:kycId/reject`

## Chats
- `GET /api/chats/conversations`
- `POST /api/chats/conversations`
- `GET /api/chats/conversations/:conversationId/messages`
- `POST /api/chats/conversations/:conversationId/messages`
- `POST /api/chats/conversations/:conversationId/read`

## Internet Vendors
- `GET /api/internet-vendors`
- `PUT /api/internet-vendors/networks`
- `POST /api/internet-vendors/sms`

## AFA Membership
- `POST /api/afa`
- `GET /api/afa/vendor/:vendorId`

## Classifieds (Buy & Sell)
- `GET /api/classifieds`
- `GET /api/classifieds/:id`
- `POST /api/classifieds`
- `DELETE /api/classifieds/:id`
