import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { defaultBankDetails } from '@/lib/bank';

// Load env from .env.local if present
loadEnv({ path: '.env.local' });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey);

  // Load seed data from JSON files
  const categoriesPath = path.resolve(process.cwd(), 'data', 'categories.json');
  const productsPath = path.resolve(process.cwd(), 'data', 'products.json');
  if (!fs.existsSync(categoriesPath) || !fs.existsSync(productsPath)) {
    console.error('Seed data files not found. Expected data/categories.json and data/products.json');
    process.exit(1);
  }
  const localCategories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8')) as any[];
  const localProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8')) as any[];

  // Upsert categories
  for (const c of localCategories) {
    const { error } = await supabase.from('categories').upsert({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      product_count: c.productCount,
      type: c.type,
    }, { onConflict: 'id' });
    if (error) throw error;
  }

  // Upsert products
  for (const p of localProducts) {
    const { error } = await supabase.from('products').upsert({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      hint: p.hint,
      description: p.description,
      category_id: p.categoryId,
      sub_category: p.subCategory ?? null,
      sub_heading: p.subHeading ?? null,
    }, { onConflict: 'id' });
    if (error) throw error;
  }

  // Upsert bank details single row
  const { error: bankError } = await supabase.from('bank_details').upsert({
    id: true,
    account_holder: defaultBankDetails.accountHolder,
    bank_name: defaultBankDetails.bankName,
    account_number: defaultBankDetails.accountNumber,
    ifsc_code: defaultBankDetails.ifscCode,
    account_type: defaultBankDetails.accountType,
    upi_id: defaultBankDetails.upiId,
    qr_image_url: defaultBankDetails.qrImageUrl,
    gst_details: defaultBankDetails.gstDetails || null,
  }, { onConflict: 'id' });
  if (bankError) throw bankError;

  console.log('Seeding complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


