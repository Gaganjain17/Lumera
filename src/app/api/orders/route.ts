import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

// GET - Fetch all orders (admin only)
export async function GET() {
  try {
    const supabase = await createAdminClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Helper function to create or get user
async function createOrGetUser(
  supabase: any,
  email: string,
  fullName: string,
  mobile: string
): Promise<{ userId: string | null; isNewUser: boolean }> {
  try {
    // First, check if user already exists in auth.users
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return { userId: null, isNewUser: false };
    }

    // Find user by email
    const existingUser = existingUsers.users.find((u: any) => u.email === email);

    if (existingUser) {
      console.log('User already exists:', existingUser.id);
      return { userId: existingUser.id, isNewUser: false };
    }

    // User doesn't exist, create new one
    console.log('Creating new user account for:', email);

    // Generate a random password (user can reset it later)
    const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        mobile: mobile,
      },
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return { userId: null, isNewUser: false };
    }

    console.log('New user created successfully:', newUser.user.id);

    // The trigger will auto-create the profile in public.users
    // Wait a moment for trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update the user profile with mobile number
    const { error: updateError } = await supabase
      .from('users')
      .update({
        mobile: mobile,
        full_name: fullName,
      })
      .eq('id', newUser.user.id);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
    }

    return { userId: newUser.user.id, isNewUser: true };
  } catch (error) {
    console.error('Error in createOrGetUser:', error);
    return { userId: null, isNewUser: false };
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
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
      paymentReceipt,
    } = body;

    // Basic validation
    if (!customerName || !customerEmail || !customerMobile || !customerAddress || !totalAmount || !orderItems) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Processing order for:', customerEmail);

    // Create or get user account
    const { userId, isNewUser } = await createOrGetUser(
      supabase,
      customerEmail,
      customerName,
      customerMobile
    );

    console.log('User ID for order:', userId, 'Is new user:', isNewUser);

    // Create order
    const orderData = {
      user_id: userId, // Will be null if user creation failed
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
        { error: error.message || 'Failed to create order', details: error.details, code: error.code },
        { status: 500 }
      );
    }

    console.log('Order created successfully:', order.id);

    // Return success with additional info
    return NextResponse.json({
      ...order,
      isNewUser,
      message: isNewUser 
        ? 'Order placed successfully! We have created an account for you. Check your email for login details.'
        : 'Order placed successfully!',
    }, { status: 201 });

  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// PATCH - Update order status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing orderId or status' },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
