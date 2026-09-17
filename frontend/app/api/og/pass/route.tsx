import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name') || 'Confirmed Delegate'
    const college = searchParams.get('college') || 'Punjab Engineering College'
    const tier = (searchParams.get('tier') || 'DELEGATE PASS').toUpperCase()
    const passId = (searchParams.get('id') || 'PEC26-DELEGATE').toUpperCase()

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#07130F',
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(126, 211, 33, 0.18) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(26, 77, 50, 0.4) 0%, transparent 60%)',
            padding: '48px 56px',
            color: '#FFFFFF',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            border: '2px solid rgba(126, 211, 33, 0.25)',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#7ED321',
                  boxShadow: '0 0 16px #7ED321',
                }}
              />
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  color: '#FFFFFF',
                }}
              >
                E-SUMMIT &apos;26
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(126, 211, 33, 0.12)',
                border: '1px solid rgba(126, 211, 33, 0.35)',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#7ED321',
                letterSpacing: '0.2em',
              }}
            >
              OFFICIAL ENTRY PASS
            </div>
          </div>

          {/* Center Attendee Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#7ED321',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              ATTENDEE DELEGATE
            </span>
            <span
              style={{
                fontSize: '56px',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#FAFAFA',
                maxWidth: '900px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 500,
                color: '#9CA3AF',
              }}
            >
              {college}
            </span>
          </div>

          {/* Bottom Card Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: 'rgba(15, 38, 28, 0.6)',
              borderRadius: '16px',
              padding: '18px 24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#7ED321', letterSpacing: '0.15em', fontWeight: 700 }}>
                PASS CATEGORY
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                {tier}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#9CA3AF', letterSpacing: '0.15em', fontWeight: 700 }}>
                DATE &amp; VENUE
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#E5E7EB' }}>
                SEPTEMBER 26–27, 2026 • PEC CHANDIGARH
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#9CA3AF', letterSpacing: '0.15em', fontWeight: 700 }}>
                PASS SERIAL
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: '#7ED321',
                }}
              >
                #{passId}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}
