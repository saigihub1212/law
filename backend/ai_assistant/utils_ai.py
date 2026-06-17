import os
import random
import requests
from django.conf import settings

def call_openai_or_groq(prompt, system_instruction):
    """
    Attempts to call OpenAI or Groq chat endpoints if keys are set in settings.
    Returns None if not configured or call fails.
    """
    # Try Groq API first (often preferred for fast developer testing)
    if settings.GROQ_API_KEY:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.2
            }
            res = requests.post(url, json=data, timeout=10)
            if res.status_code == 200:
                return res.json()['choices'][0]['message']['content']
        except Exception:
            pass

    # Try OpenAI API
    if settings.OPENAI_API_KEY:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.2
            }
            res = requests.post(url, json=data, timeout=10)
            if res.status_code == 200:
                return res.json()['choices'][0]['message']['content']
        except Exception:
            pass
            
    return None

def run_local_patent_assessment(innovation_details, industry, existing_products, patent_status):
    """
    Local IPR Expert assessment rules. Computes detailed patentability metrics
    by inspecting keywords in the user inputs.
    """
    score = 75 # Default base score
    detail_lower = innovation_details.lower()
    product_lower = existing_products.lower()
    
    # Adjust score based on length and details
    if len(innovation_details) < 40:
        score -= 15
    elif len(innovation_details) > 200:
        score += 10
        
    # Novelty deductions if they list direct similar products
    if len(existing_products) > 15 and "yes" in product_lower or "similar" in product_lower or "same" in product_lower:
        score -= 20
    elif "no" in product_lower or "none" in product_lower or "unique" in product_lower:
        score += 8
        
    # Patent status boosts/deductions
    if "filed" in patent_status.lower() or "provisional" in patent_status.lower():
        score += 5
    elif "expired" in patent_status.lower():
        score -= 10

    # Ensure range
    score = max(30, min(98, score))
    
    # Generate custom details based on industry keyword mapping
    ind_mapping = {
        "software": {
            "novelty": "The core software architecture and algorithmic workflow seem to present features not found in standard frameworks, especially regarding the data throughput layer.",
            "inventive": "Requires demonstrating a technical solution to a technical problem. Abstract mathematical concepts are excluded. Ensure algorithms are tied to specific hardware efficiency or network enhancements.",
            "utility": "Clear industrial applicability in software automation, server-side data routing, and analytics processing.",
            "obstacles": "Exclusions under patent laws regarding 'abstract software ideas' and math formulas (e.g., Section 3(k) of the Indian Patent Act or Alice guidelines in the US)."
        },
        "biotech": {
            "novelty": "Chemical composition or molecular/biological formulation shows unique properties. Novelty is high if the gene sequence or microbial culture behaves in a non-standard fashion.",
            "inventive": "Must prove synergistic action rather than a simple admixture of known compounds. Demonstration of efficacy enhancements is paramount.",
            "utility": "Direct therapeutic, clinical, agricultural, or diagnostic application.",
            "obstacles": "Strong regulation against patenting naturally occurring substances, living organisms, and methods of medical treatment."
        },
        "hardware": {
            "novelty": "Mechanical or structural utility changes show physical configuration improvements that reduce friction, weight, or power draw.",
            "inventive": "Must show that the combination of gears, modules, or sensors produces an output that would not have been obvious to a skilled mechanic in the field.",
            "utility": "Direct use in heavy machinery, consumer electronics, or physical system manufacturing.",
            "obstacles": "Prior art databases are heavily populated with mechanical drawings. Thorough search of global databases is mandatory."
        }
    }
    
    # Default fallback
    selected_ind = "software"
    for k in ind_mapping.keys():
        if k in industry.lower():
            selected_ind = k
            break
            
    meta = ind_mapping[selected_ind]
    
    # If the user input was highly detailed, supplement the answers
    novelty_txt = meta["novelty"] + f" The concept focuses on addressing the constraints identified in: '{existing_products}'."
    inventive_txt = meta["inventive"] + " The proposed novelty must bypass standard industry methods."
    utility_txt = meta["utility"] + " Shows immediate commercial feasibility."
    obstacles_txt = meta["obstacles"] + " Standard prior-art searches will clarify if minor features overlap with existing registered documents."
    
    next_steps = [
        "Conduct a comprehensive Novelty Search across WIPO, USPTO, EPO, and IPO databases.",
        "Draft a Provisional Patent Specification to lock in the priority date.",
        "Detail the technical system flowcharts and structural diagrams to satisfy description adequacy.",
        "Consult with SR4IPR Partners to file a formal patent application."
    ]

    return {
        "patentability_score": score,
        "novelty_report": novelty_txt,
        "inventive_step": inventive_txt,
        "industrial_applicability": utility_txt,
        "potential_obstacles": obstacles_txt,
        "next_steps": next_steps,
        "method": "Expert System Rule Engine"
    }

def run_local_legal_assistant(message):
    """
    Formulates a legally safe, helpful response from SR4IPR Partners Assistant
    covering patents, trademarks, copyright, scheduling, and general firm services.
    """
    msg = message.lower()
    
    # Define response blocks
    welcome = "Hello, I am the SR4IPR Partners AI Legal Assistant. I can answer general questions regarding Patents, Trademarks, Copyrights, and our consultation process."
    
    patent_info = """
**Patent Filing & Requirements:**
A patent protects new, non-obvious, and industrially useful inventions. 
- **Key criteria:** Novelty, Inventive Step, and Utility.
- **Filing types:** Provisional Application (secures priority date for 12 months) and Complete Specification.
- **Term:** 20 years from the date of filing.
    """
    
    trademark_info = """
**Trademark Registration:**
A trademark protects brand names, logos, slogans, and symbols. It prevents confusion in the marketplace.
- **Key criteria:** Distinctiveness (avoid descriptive or generic terms).
- **Process:** Trade Mark Search -> Filing -> Examination -> Publication in Journal -> Registration.
- **Term:** 10 years, renewable indefinitely.
    """
    
    copyright_info = """
**Copyright Protection:**
Copyright protects original literary, dramatic, musical, artistic works, software code, and sound recordings.
- **Protection:** It exists automatically upon creation, but registration acts as prima facie evidence in court.
- **Term:** Lifetime of the author plus 60 years (in India) or 70 years (in many other countries).
    """

    cost_info = """
**Fee & Cost Estimates:**
Our registration and drafting fees vary based on project complexity:
- **Trademarks:** Search & filing starting from relatively cost-effective rates per class.
- **Patents:** Prior art searches, draft preparation, and official filing fees vary depending on individual vs start-up vs corporate entity status.
You can calculate interactive pricing using our online **Cost Calculator** on the navigation bar!
    """

    consult_info = """
**Scheduling a Consultation:**
You can book an official 30-minute Zoom or Google Meet session directly using our **Book Consultation** page. Our lawyers will evaluate your technological drawings or brand names under strict confidentiality agreements (NDAs).
    """

    default_response = """
Thank you for your enquiry. We provide comprehensive IPR services including:
1. **Patents:** Search, drafting, filing, and prosecution.
2. **Trademarks:** Brand search, registration, and trademark opposition.
3. **Copyrights:** Software code and creative assets registrations.
4. **Litigation:** Enforcement against infringements.
Please book a consultation or send details via our Contact form to speak with an IP Partner.
    """
    
    disclaimer = "\n\n*Disclaimer: AI assistant responses are for informational purposes only and do not constitute formal legal advice. A formal attorney-client relationship is only established upon executing an engagement letter.*"
    
    # Keyword routing logic
    response_body = ""
    if "patent" in msg or "invent" in msg:
        response_body += patent_info
    if "trademark" in msg or "brand" in msg or "logo" in msg:
        response_body += trademark_info
    if "copyright" in msg or "software" in msg or "code" in msg or "author" in msg:
        response_body += copyright_info
    if "cost" in msg or "price" in msg or "fee" in msg or "charge" in msg or "estimate" in msg:
        response_body += cost_info
    if "book" in msg or "consult" in msg or "schedule" in msg or "zoom" in msg or "meet" in msg:
        response_body += consult_info
        
    if not response_body:
        response_body = welcome + "\n" + default_response
    else:
        response_body = welcome + "\n" + response_body
        
    return response_body + disclaimer
