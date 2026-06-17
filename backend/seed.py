import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from cms.models import PageContent, Service, TeamMember, FAQ, Testimonial, Blog, SEOConfig

User = get_user_model()

def seed_db():
    print("Starting database seeding...")

    # 1. Create Admin & SuperAdmin Accounts
    if not User.objects.filter(email='admin@sr4ipr.com').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@sr4ipr.com',
            password='adminpassword123',
            role='SUPERADMIN',
            phone='+1 (555) 019-2834',
            first_name='SR4IPR',
            last_name='Administrator'
        )
        print("SuperAdmin account created: admin@sr4ipr.com / adminpassword123")
    else:
        print("Admin user already exists.")

    # Create a mock client for testing the client portal
    if not User.objects.filter(email='client@example.com').exists():
        client = User.objects.create_user(
            username='client',
            email='client@example.com',
            password='clientpassword123',
            role='CLIENT',
            phone='+1 (555) 987-6543',
            first_name='Alex',
            last_name='Novak'
        )
        print("Client account created: client@example.com / clientpassword123")

    # 2. Create Page Content (Home, About)
    home_content = {
        "hero_title": "Enterprise Intellectual Property Protection Globally",
        "hero_subtitle": "SR4IPR Partners provides elite, cross-border patent prosecution, strategic trademark portfolio management, and rigorous copyright enforcement for pioneering technology companies.",
        "hero_image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
        "cta_primary_text": "Schedule Strategy Session",
        "cta_secondary_text": "AI Patent Assessment",
        "stats_claims_resolved": "1,500+",
        "stats_patent_rate": "97.4%",
        "stats_active_clients": "350+",
        "stats_countries": "45+",
        "why_choose_title": "Why Global Innovators Choose SR4IPR",
        "why_choose_desc": "We combine advanced technical expertise in engineering and biosciences with elite legal acumen to secure and monetize your most valuable commercial assets.",
    }
    
    PageContent.objects.update_or_create(
        page_name='home',
        defaults={'content': home_content}
    )
    print("Home page content seeded.")

    about_content = {
        "company_overview": "SR4IPR Partners is a premier, tier-one international intellectual property firm representing venture-backed startups, research universities, and Fortune 500 corporations. Our team comprises registered patent attorneys, technical PhDs, and litigators who operate at the intersection of emerging technologies and complex statutory law.",
        "vision": "To lead the global standard for IP protection by developing hyper-effective patent structures and trademark defense strategies that protect enterprise value in a hyper-competitive digital economy.",
        "mission": "To provide rigorous, technical, and commercial-minded counsel that transforms scientific innovations into bulletproof global patent assets.",
        "history_timeline": [
            {"year": "2015", "event": "SR4IPR Partners founded by veteran IP litigators in response to cross-border tech infringement rises."},
            {"year": "2018", "event": "Expanded practice to include specialized biochemical and machine-learning patent drafting groups."},
            {"year": "2021", "event": "Opened overseas liaison desks to expedite WIPO and USPTO client portfolio filings."},
            {"year": "2024", "event": "Ranked in top legal indexes for Patent Prosecution & Trademark enforcement success rates."}
        ]
    }
    
    PageContent.objects.update_or_create(
        page_name='about',
        defaults={'content': about_content}
    )
    print("About page content seeded.")

    # Site-wide settings
    site_settings_content = {
        "email": "consult@sr4ipr.com",
        "phone": "+91 22 5543-0980",
        "hq_address": "Level 14, Nariman Point, Mumbai - 400021, India",
        "liaison_address": "Canary Wharf, London E14, United Kingdom",
        "copyright": "SR4IPR Partners. All Rights Reserved.",
        "linkedin_url": "https://linkedin.com/company/sr4ipr",
        "twitter_url": "",
        "facebook_url": "",
    }
    PageContent.objects.update_or_create(
        page_name='settings',
        defaults={'content': site_settings_content}
    )
    print("Site settings seeded.")

    # 3. Services Seeding
    services_list = [
        {
            "name": "Patent Prosecution & Drafting",
            "slug": "patent-services",
            "category": "PATENT",
            "short_desc": "End-to-end patent drafting, filing, and prosecution services with high approval ratios.",
            "long_desc": "Our team drafts detailed specifications for provisional and complete patents. We possess deep technical experts in software, AI, electronics, chemical mixtures, and mechanical structures, ensuring your patent passes rigourous examiner audits.",
            "icon": "ShieldAlert",
            "details_list": ["Provisional Patent Specifications", "Utility Patent Drafting", "WIPO / PCT International Filing", "Office Action Analysis & Responses", "Patent Landscaping & Prior Art Searches"]
        },
        {
            "name": "Trademark Portfolio Management",
            "slug": "trademark-services",
            "category": "TRADEMARK",
            "short_desc": "Global brand searches, class allocation, applications, and opposition defense.",
            "long_desc": "We establish, protect, and police brand assets, product marks, and logos. Our specialists manage brand clearances, address examiner objections, and enforce trademarks against counterfeiters globally.",
            "icon": "Tags",
            "details_list": ["Comprehensive Clearance Search", "Trademark Class Classification", "Filing & Prosecution Management", "Trademark Monitoring & Enforcement", "Opposition & Rectification Proceedings"]
        },
        {
            "name": "Copyright Protection & Registration",
            "slug": "copyright-services",
            "category": "COPYRIGHT",
            "short_desc": "Software code registry, database rights, and artistic ownership legal filings.",
            "long_desc": "We secure registrations for software codebases, proprietary databases, API architectures, literary works, and designs, ensuring solid legal standing for copyright claims.",
            "icon": "FileText",
            "details_list": ["Software & Codebase Registration", "Database Rights Protection", "Licensing & Assignment Contracts", "Digital Millennium Copyright Act (DMCA) Take-Downs", "Copyright Infringement Remedies"]
        },
        {
            "name": "Industrial Design Registration",
            "slug": "design-registration",
            "category": "DESIGN",
            "short_desc": "Securing exclusive visual aesthetic structures and unique hardware outlines.",
            "long_desc": "We file design protection requests to prevent competitors from copying the shape, configuration, ornament, or aesthetic layout of your manufactured hardware products.",
            "icon": "Cpu",
            "details_list": ["Novelty Assessment & Drawings", "Filing & Class Registrations", "Design Prosecution support", "Infringement Auditing"]
        },
        {
            "name": "Geographical Indication Registry",
            "slug": "geographical-indication",
            "category": "GI",
            "short_desc": "Securing community rights for regional products and indigenous goods.",
            "long_desc": "We represent trade boards, state agencies, and agricultural associations in registering geographical source titles to maintain exclusive quality margins.",
            "icon": "Globe",
            "details_list": ["GI clearance & historical audit", "Association incorporation support", "Enforcement against generic label fraud"]
        },
        {
            "name": "IP Litigation & Enforcement",
            "slug": "litigation-enforcement",
            "category": "LITIGATION",
            "short_desc": "Aggressive legal action, patent litigation, injunctions, and custom clearances.",
            "long_desc": "Our veteran trial lawyers represent plaintiffs and defendants in high-stakes patent battles, copyright actions, trade secret thefts, and trademark infringement litigations.",
            "icon": "Scale",
            "details_list": ["Cease & Desist Orders", "Temporary & Permanent Injunctions", "Patent & Trademark Litigation", "Custom Enforcement & Anti-Counterfeiting", "Trade Secret Protection & Auditing"]
        }
    ]

    for s in services_list:
        Service.objects.update_or_create(
            slug=s['slug'],
            defaults=s
        )
    print("Services seeded.")

    # 4. Team Members
    team_list = [
        {
            "name": "Siddharth Rao, Esq.",
            "role": "Senior Managing Partner",
            "image_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
            "bio": "Siddharth has over 20 years of experience in patent prosecution and technological joint-venture licensing. He regularly advises Fortune 100 technology corporations on multi-national IP strategy.",
            "qualifications": "L.L.M (IP Law) - Georgetown University, B.Tech (Computer Science)",
            "experience": "22 Years",
            "linkedin_url": "https://linkedin.com",
            "twitter_url": "https://twitter.com",
            "email": "s.rao@sr4ipr.com"
        },
        {
            "name": "Dr. Aradhana Sen",
            "role": "Head of Biotechnology & Patent Agent",
            "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
            "bio": "Dr. Sen is a registered patent agent managing pharmaceutical, biochemical, and agricultural gene-patenting applications. She is highly skilled in drafting complex cell cultures and chemical formulations.",
            "qualifications": "Ph.D in Molecular Biology - Stanford University, Registered Patent Agent",
            "experience": "14 Years",
            "linkedin_url": "https://linkedin.com",
            "twitter_url": "https://twitter.com",
            "email": "a.sen@sr4ipr.com"
        },
        {
            "name": "Marcus Vance",
            "role": "Lead Litigation Counsel",
            "image_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
            "bio": "Marcus oversees our litigation and enforcement group, focusing on patent infringement, trademark oppositions, DMCA takedowns, and licensing disputes.",
            "qualifications": "J.D. - Harvard Law School, BS in Mechanical Engineering",
            "experience": "16 Years",
            "linkedin_url": "https://linkedin.com",
            "twitter_url": "https://twitter.com",
            "email": "m.vance@sr4ipr.com"
        }
    ]

    for t in team_list:
        TeamMember.objects.update_or_create(
            name=t['name'],
            defaults=t
        )
    print("Team members seeded.")

    # 5. FAQs
    faqs_list = [
        {"question": "What is the difference between a Patent, Trademark, and Copyright?", "answer": "A patent protects new inventions (e.g. mechanisms, software solutions, chemical compounds). A trademark protects brand identifiers (e.g. logos, brand names, slogans). A copyright protects original creative works of authorship (e.g. source code, books, paintings, music).", "category": "General"},
        {"question": "How long does a patent application take to be granted?", "answer": "The duration varies depending on jurisdictions. For example, in the US (USPTO) or India (IPO), it can take between 2 to 4 years. Utilizing expedited examination schemes (such as for startups or female applicants) can reduce the timeline to 1 to 2 years.", "category": "Patent"},
        {"question": "Can software source code be patented?", "answer": "Generally, software code itself is protected by copyright. However, if the software solves a technical problem in a novel, non-obvious way and has a concrete utility (e.g. speeding up image processing, enhancing device communication), it may be eligible for a utility patent.", "category": "Patent"},
        {"question": "What is a Provisional Patent and why should I file it?", "answer": "A provisional patent is a lightweight application that establishes an early priority filing date. It gives you 12 months to refine your invention and seek funding before you must file a detailed Complete Specification.", "category": "Patent"},
        {"question": "What does a trademark clearance search involve?", "answer": "A clearance search checks national and international trademark databases to verify that your proposed brand name or logo is not identical or confusingly similar to already registered marks in the same product/service classes.", "category": "Trademark"}
    ]

    for f in faqs_list:
        FAQ.objects.update_or_create(
            question=f['question'],
            defaults=f
        )
    print("FAQs seeded.")

    # 6. Testimonials
    testimonials_list = [
        {
            "client_name": "Sarah Jenkins",
            "client_role": "Chief Technology Officer",
            "company": "NeuraLink Analytics",
            "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
            "feedback": "SR4IPR Partners drafted our AI core algorithmic patents. Their technical understanding of neural networks matched our engineers' expertise, and the patents were approved with zero major objections.",
            "approved": True
        },
        {
            "client_name": "Devin Kumar",
            "client_role": "Founder & CEO",
            "company": "HoloSphere Hardware",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
            "feedback": "The team at SR4IPR Partners handled our global trademark clearance and filing across 12 countries. Their dashboard kept us updated on every examination request. Highly professional.",
            "approved": True
        }
    ]

    for tm in testimonials_list:
        Testimonial.objects.update_or_create(
            client_name=tm['client_name'],
            defaults=tm
        )
    print("Testimonials seeded.")

    # 7. Blog CMS
    Blog.objects.update_or_create(
        title="Navigating the Patent Cooperation Treaty (PCT) for Global Scale",
        slug="navigating-pct-global-patent",
        defaults={
            "summary": "Expanding into international markets requires a strategic approach to patent protection. Learn how the PCT provides a unified procedure for filing patent applications to protect your inventions globally.",
            "content": """
Filing patent applications in individual foreign countries can be an administrative and financial nightmare for startups. The Patent Cooperation Treaty (PCT) offers a streamlined solution.

### What is the PCT?
The PCT is an international treaty with more than 150 contracting states. It is administered by WIPO (World Intellectual Property Organization). By filing a single 'international' patent application under the PCT, you can simultaneously seek protection for an invention in a vast number of countries.

### Key Advantages:
1. **Time and Flexibility:** You get up to 30 months from your initial filing date to decide which specific countries you wish to proceed in. This gives you extra time to secure seed funding or assess product-market fit.
2. **Unified Search Report:** You receive an International Search Report (ISR) containing prior-art citations. This allows you to evaluate your patent's chances of success before spending thousands in regional filing fees.
3. **Simplified Process:** One application, filed in one language, with one set of formal requirements.

### Best Practices for Technology Startups:
- Always file a **Provisional Application** first to lock in your priority date cheap.
- Use the **WIPO search report** to modify claims and delete uninventive parameters before entering national phases.
- Budget for national phase translation fees and local foreign attorneys ahead of the 30-month deadline.
            """,
            "category": "Patents",
            "image_url": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
            "status": "PUBLISHED",
            "seo_title": "PCT International Patent Filing Strategy | SR4IPR Partners",
            "seo_description": "Learn the advantages of the Patent Cooperation Treaty (PCT) to file international patent applications and save on foreign registration costs.",
            "published_at": django.utils.timezone.now()
        }
    )
    print("Sample Blog seeded.")

    # 8. SEO Config
    SEOConfig.objects.update_or_create(
        route_path='/',
        defaults={
            "title": "SR4IPR Partners | Elite IP Rights Legal Counsel",
            "meta_description": "Enterprise-grade Intellectual Property Protection. Specializing in patents prosecution, international trademark management, copyright registries, and IP enforcement litigation.",
            "keywords": "SR4IPR, SR4IPR Partners, Patent law, trademark filing, copyright protection, IP attorney, tech patenting",
            "og_image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
            "canonical_url": "https://www.sr4ipr.com/"
        }
    )
    print("SEO config seeded.")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_db()
