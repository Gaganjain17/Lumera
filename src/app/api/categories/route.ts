import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const supabase = getSupabaseClient();
  const [catsRes, prodsRes] = await Promise.all([
    supabase.from('categories').select('*').order('id'),
    supabase.from('products').select('id, category_id'),
  ]);
  if (catsRes.error) return NextResponse.json({ error: catsRes.error.message }, { status: 500 });
  if (prodsRes.error) return NextResponse.json({ error: prodsRes.error.message }, { status: 500 });

  const counts = new Map<number, number>();
  for (const p of prodsRes.data || []) {
    const key = (p as any).category_id as number;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const mapped = (catsRes.data || []).map((c: any) => {
    const count = counts.get(c.id) ?? c.product_count ?? 0;
    return {
      ...c,
      product_count: count,
      productCount: count,
    };
  });

  return NextResponse.json(mapped);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('categories').insert({
    name: body.name,
    slug: body.slug,
    description: body.description,
    image: body.image,
    product_count: body.productCount ?? 0,
    type: body.type,
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
      product_count: body.productCount,
      type: body.type,
    })
    .eq('id', body.id)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('categories').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
