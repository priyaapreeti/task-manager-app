import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '../../../../../models/User'
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    return NextResponse.json({ id: user._id, email: user.email, name: user.name }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Register failed' }, { status: 500 });
  }
}