import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const query = supabase.from('products').select('*');
  const builder = categoryId ? query.eq('category_id', Number(categoryId)) : query;
  const { data, error } = await builder.order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('products').insert({
    name: body.name,
    price: body.price,
    image: body.image,
    hint: body.hint,
    description: body.description,
    category_id: body.categoryId,
    sub_category: body.subCategory ?? null,
    sub_heading: body.subHeading ?? null,
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('products').update({
    name: body.name,
    price: body.price,
    image: body.image,
    hint: body.hint,
    description: body.description,
    category_id: body.categoryId,
    sub_category: body.subCategory ?? null,
    sub_heading: body.subHeading ?? null,
  }).eq('id', body.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('products').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
