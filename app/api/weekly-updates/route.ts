import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST: Create a new update
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { data: insertData, error } = await supabase
    .from('weekly_updates')
    .insert([data])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(insertData[0]);
}

// GET: List all updates
export async function GET() {
  const { data, error } = await supabase
    .from('weekly_updates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE: Delete an update by id (expects ?id=...)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }
  const { error } = await supabase
    .from('weekly_updates')
    .delete()
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
