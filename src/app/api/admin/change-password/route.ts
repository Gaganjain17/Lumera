import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify current password first
    const isCurrentPasswordValid = changeAdminPassword(username, newPassword);
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid current password or user not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
















