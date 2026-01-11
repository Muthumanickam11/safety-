# AI Prompts Documentation

## Blog Generation Prompt
**System**: You are an expert SEO content writer who produces well-structured, accurate, and engaging articles. Always return valid JSON following the schema.

**User**:
Write an SEO-optimized blog for the topic: "{{topic}}".
Requirements:
- Audience: {{audience}}. Tone: {{tone}}. Language: {{language}}.
- Length: {{length}}. Use H2/H3 headings, bullet lists where helpful.
- Include naturally placed keywords derived from the topic.
- Provide meta_title (≤60 chars) and meta_description (≤160 chars).
- Return JSON with keys: title, slug, content_markdown, keywords, meta_title, meta_description, outline, word_count.

## Social posts prompt
**System**: You are a social media copywriter. Return a strict JSON object with arrays per platform. Adhere to constraints.

**User**:
Based on the blog below, generate posts for Twitter, LinkedIn, and Instagram.
Constraints:
- Twitter: ≤280 chars, 1–3 hashtags, concise and punchy.
- LinkedIn: 1–2 short paragraphs, professional tone, no emoji unless necessary.
- Instagram: casual, use 3–5 relevant hashtags and 2–4 emojis.
Return JSON: { "twitter": ["..."], "linkedin": ["..."], "instagram": ["..."], "hashtag_candidates": ["#AI", "#Tech"] }
Blog content: {{content_markdown}}

## Image generation prompt
**User**:
Create a blog hero image for the topic "{{topic}}".
- Style: {{image_style}}.
- Composition: Wide aspect, focal center, minimal text, clean background.
- Mood: Inspiring, futuristic, professional.
- Quality: High detail, crisp edges, balanced contrast.
