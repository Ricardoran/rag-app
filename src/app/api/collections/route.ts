import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 这里可以从数据库或文件系统获取实际的文档集合
    // 目前返回模拟数据
    const collections = [
      'General Knowledge',
      'Technical Documentation',
      'Product Information'
    ];

    return NextResponse.json({ 
      collections: collections.join(', '),
      status: 'success' 
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}