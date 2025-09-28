import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('bank_details').select('*').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json(null);
  // map to camelCase for frontend
  const mapped = {
    accountHolder: data.account_holder,
    bankName: data.bank_name,
    accountNumber: data.account_number,
    ifscCode: data.ifsc_code,
    accountType: data.account_type,
    upiId: data.upi_id,
    qrImageUrl: data.qr_image_url,
    gstDetails: (data as any).gst_details ?? null,
  };
  return NextResponse.json(mapped);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  const upsertPayload = {
    id: true,
    account_holder: body.accountHolder,
    bank_name: body.bankName,
    account_number: body.accountNumber,
    ifsc_code: body.ifscCode,
    account_type: body.accountType,
    upi_id: body.upiId,
    qr_image_url: body.qrImageUrl,
    // accept legacy gstNumber but prefer gstDetails
    gst_details: (body.gstDetails ?? body.gstNumber) ?? null,
  };
  const { data, error } = await supabase.from('bank_details').upsert(upsertPayload, { onConflict: 'id' }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}


