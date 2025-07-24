import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const responses = await openai.responses.create({
      model: 'gpt-4.1',
      tools: [ { type: "web_search_preview" } ],
      input: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that provides informative responses. When answering questions, structure your response clearly and mention if you would typically need to search through documents or a knowledge base to provide more specific information.'
        },
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.7,
    });
    const response = responses.output_text || 'No response generated';
    
    // Mock sources for demonstration - in a real RAG system, these would come from your knowledge base
    const mockSources = [
      'Knowledge Base Document 1.pdf',
      'Research Article 2.pdf',
      'Reference Material 3.html'
    ];

    return NextResponse.json({
      response,
      sources: mockSources
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
