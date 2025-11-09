import mongoose from 'mongoose';

import { connectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { VendorCategory } from '../modules/vendors/vendor.model.js';
import { createVendor } from '../modules/vendors/vendor.service.js';
import { createProduct } from '../modules/products/product.service.js';
import { createUser } from '../modules/users/user.service.js';
import { UserRole } from '../modules/users/user.model.js';

const run = async () => {
  await connectDatabase();

  const admin = await createUser({
    name: 'Admin User',
    email: 'admin@nsamark.com',
    password: 'Password123!',
    role: UserRole.ADMIN
  });

  const vendorUser = await createUser({
    name: 'Sample Vendor',
    email: 'vendor@nsamark.com',
    password: 'Password123!',
    role: UserRole.VENDOR
  });

  const vendor = await createVendor({
    user: vendorUser._id.toString(),
    category: VendorCategory.MINI_MART,
    storeName: 'Sample Mini Mart',
    address: 'Accra, Ghana'
  });

  await createProduct({
    vendor: vendor._id.toString(),
    name: 'Sample Product',
    price: 50,
    stock: 10,
    description: 'A placeholder product for testing'
  });

  console.log('Seed data inserted successfully');
  await mongoose.connection.close();
};

run().catch((error) => {
  console.error(error);
  mongoose.connection.close();
});
