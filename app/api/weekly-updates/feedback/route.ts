import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST: Add feedback for an update
export async function POST(req: Request) {
  try {
    const { update_id, type, author, content } = await req.json();
    if (!update_id || !type || !author || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!['went-well', 'can-improve'].includes(type)) {
      return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('update_feedback')
      .insert([{ update_id, type, author, content }])
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: List all feedback for all updates
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('update_feedback')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 