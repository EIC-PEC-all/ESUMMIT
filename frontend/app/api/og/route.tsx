import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get('name') || 'Entrepreneur & Innovator';
    const passType = searchParams.get('tier') || 'SUMMIT PASS';
    const passId = searchParams.get('id') || 'PEC-2026';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0B1410',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(16, 185, 129, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.05) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            color: '#FFFFFF',
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#10B981',
                  color: '#0B1410',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: '2px',
                }}
              >
                E-SUMMIT &apos;26
              </div>
              <div style={{ fontSize: 18, color: '#A7F3D0', fontWeight: 600 }}>
                PUNJAB ENGINEERING COLLEGE
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34D399',
                padding: '6px 18px',
                borderRadius: '999px',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              OFFICIAL ENTRY PASS
            </div>
          </div>

          {/* Center: Attendee Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                fontSize: 18,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: 600,
              }}
            >
              Confirmed Attendee
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                maxWidth: '900px',
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  color: '#E5E7EB',
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {passType.replace('_', ' ')}
              </div>
              <div
                style={{
                  color: '#10B981',
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                {passId}
              </div>
            </div>
          </div>

          {/* Footer Dates & Venue */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
                SEPTEMBER 26–27, 2026
              </div>
              <div style={{ fontSize: 16, color: '#9CA3AF' }}>
                Sector 12, Chandigarh • EIC PEC
              </div>
            </div>

            <div
              style={{
                fontSize: 16,
                color: '#10B981',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              pecesummit.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response('Failed to generate pass OG preview image', { status: 500 });
  }
}
