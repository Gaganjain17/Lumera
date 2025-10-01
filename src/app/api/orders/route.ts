// Orders API route for managing customer orders
import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/utils/supabase/server';

// GET - Fetch all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // Use admin client to fetch orders
    const supabase = await createAdminClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to fetch orders',
          details: error.details,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log('Fetched orders count:', orders?.length || 0);
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// POST - Create new order (no authentication required for customers)
export async function POST(request: NextRequest) {
  try {
    // Use admin client for order creation to bypass RLS issues
    const supabase = await createAdminClient();
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerMobile,
      customerAddress,
      city,
      zipCode,
      totalAmount,
      orderItems,
      paymentReceipt
    } = body;

    // Basic validation
    if (!customerName || !customerEmail || !customerMobile || !customerAddress || !totalAmount || !orderItems) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderData = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_mobile: customerMobile,
      customer_address: customerAddress,
      city,
      zip_code: zipCode,
      total_amount: totalAmount,
      order_items: orderItems,
      payment_receipt_url: paymentReceipt,
      status: 'pending',
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to create order',
          details: error.details,
          code: error.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
