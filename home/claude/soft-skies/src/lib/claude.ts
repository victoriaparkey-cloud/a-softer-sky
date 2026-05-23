import type { Swatch, SkyReading } from './types'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

/**
 * Send the extracted palette to Claude and receive a poetic sky reading:
 * a palette title, mood description, and custom colour names.
 */
export async function generateSkyReading(swatches: Swatch[]): Promise<SkyReading> {
  const hexList = swatches.map(s => s.hex).join(', ')
  const count = swatches.length

  const prompt = buildPrompt(hexList, count)

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // In production, route this through your own backend endpoint
      // so you never expose the API key client-side.
      // For MVP/local dev: set VITE_ANTHROPIC_API_KEY in your .env
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const text: string = data.content?.[0]?.text ?? ''

  return parseReading(text, count)
}

// ── Prompt ─────────────────────────────────────────────────────────────────

function buildPrompt(hexList: string, count: number): string {
  return `You are the poetic soul behind a sky journal app called Soft Skies. People photograph sunrises, sunsets, and sky moments — and you write a short intimate reading of each one based on its colour palette.

Colour palette extracted from the photo (hex values, ordered by visual dominance): ${hexList}

Respond ONLY with a valid JSON object. No markdown fences, no explanation, no preamble:

{
  "title": "two or three words — a poetic palette name like 'Ember Dusk', 'Pale Meridian', 'The Hour Before'",
  "mood": "one paragraph, 2–4 sentences. Sensory, present tense, intimate. Describe what this light felt like to stand in. No clichés, no purple prose. Think: a caption from a film still. Sparse. Grounded.",
  "colorNames": ${JSON.stringify(Array.from({ length: count }, (_, i) => `evocative name for colour ${i + 1}`))}
}

For colorNames: give each colour a short, original name — the kind you'd find in a Japanese or Scandinavian paint range. Maximum 3 words each. Match the emotional weight of the colour: if it's a bruised violet, name it accordingly. If it's a faded apricot, let the name carry that softness.`
}

// ── Parser ─────────────────────────────────────────────────────────────────

function parseReading(text: string, swatchCount: number): SkyReading {
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean) as SkyReading

    // Ensure colorNames array matches swatch count
    const names = Array.isArray(parsed.colorNames) ? parsed.colorNames : []
    while (names.length < swatchCount) names.push(`colour ${names.length + 1}`)

    return {
      title: parsed.title ?? 'unnamed sky',
      mood: parsed.mood ?? '',
      colorNames: names.slice(0, swatchCount),
    }
  } catch {
    return fallbackReading(swatchCount)
  }
}

function fallbackReading(count: number): SkyReading {
  return {
    title: 'unnamed sky',
    mood: 'The light held its breath before changing. Something in the colour of this hour felt like a letter never sent — warm where you expect cold, quiet where you expect sound.',
    colorNames: [
      'ashen blush', 'faded meridian', 'dusk copper',
      'soft sienna', 'pale driftwood', 'evening haze', 'last light',
    ].slice(0, count),
  }
}
