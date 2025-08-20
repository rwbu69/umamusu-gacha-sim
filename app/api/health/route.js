import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      gachaSystem: 'operational',
      dataFiles: 'loaded',
      localStorage: 'client-side'
    }
  };

  return NextResponse.json(healthCheck, { status: 200 });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
