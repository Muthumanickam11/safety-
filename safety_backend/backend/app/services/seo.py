import re

def compute_keyword_density(content: str, keywords: list) -> dict:
    words = re.findall(r'\w+', content.lower())
    total_words = len(words)
    if total_words == 0:
         return {"density": {}, "score": 0}
         
    density = {}
    for kw in keywords:
        count = content.lower().count(kw.lower())
        density[kw] = (count / total_words) * 100
        
    # Simple score based on density (ideal 1-2%)
    score = 0
    for d in density.values():
        if 0.5 <= d <= 2.5:
            score += 20
            
    return {"density": density, "score": min(score, 100)}

def suggest_meta(content: str) -> dict:
    # Basic logic to suggest meta based on first paragraph
    paragraphs = content.split('\n\n')
    first_para = paragraphs[0] if paragraphs else ""
    
    return {
        "suggested_meta_title": first_para[:60] if first_para else "SEO Optimized Blog",
        "suggested_meta_description": first_para[:160] if first_para else "Read our latest content."
    }

def compute_seo_score(content: str, keywords: list) -> int:
    score = 0
    if not content or not keywords:
        return 0
    
    # Simple SEO logic
    # Title exists (implied)
    score += 20
    
    # Word count > 500
    words = content.split()
    if len(words) > 500:
        score += 20
    elif len(words) > 300:
        score += 10
        
    # Keyword density check
    found_keywords = 0
    for kw in keywords:
        if kw.lower() in content.lower():
            found_keywords += 1
            
    if found_keywords >= len(keywords) / 2:
        score += 30
        
    # Heading checks (H1, H2)
    if "# " in content:
        score += 15
    if "## " in content:
        score += 15
        
    return min(score, 100)

def compute_reading_time(content: str) -> int:
    words = content.split()
    # Avg reading speed 200 wpm
    return max(1, len(words) // 200)

def extract_keywords(content: str) -> list:
    # Basic keyword extraction using regex (simplified)
    # real production would use NLP
    words = re.findall(r'\w+', content.lower())
    # remove common stop words (very basic list)
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'about'}
    filtered = [w for w in words if w not in stop_words and len(w) > 4]
    
    from collections import Counter
    counts = Counter(filtered)
    return [word for word, count in counts.most_common(5)]
