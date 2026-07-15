import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path') || '/';

  const defaultSEO = {
    title: 'SR4IPR Partners | Elite IP Rights Legal Counsel',
    meta_description: 'Premier international intellectual property law firm specializing in patents, trademarks, copyrights, design registration, and IP litigation.',
    keywords: 'intellectual property, patents, trademark registration, copyright law, IP litigation, Mumbai, London, patent agents, IP attorney',
    canonical_url: '',
    og_image: '',
  };

  const seoData = { ...defaultSEO };

  if (path === '/') {
    seoData.title = 'SR4IPR Partners | Elite IP Rights Legal Counsel';
    seoData.meta_description = 'Premier international intellectual property law firm specializing in patents, trademarks, copyrights, design registration, and IP litigation.';
  } else if (path.startsWith('/about')) {
    seoData.title = 'About Us | SR4IPR Partners';
    seoData.meta_description = 'Learn about our founders, our history since 2015, and our expert team of PhD technical experts and senior IP litigators.';
  } else if (path.startsWith('/services')) {
    seoData.title = 'Practice Areas & Services | SR4IPR Partners';
    seoData.meta_description = 'Explore our end-to-end IP services, including Patent Prosecution, Trademark Portfolio Management, Copyrights, and IP Litigation.';
  } else if (path.startsWith('/team')) {
    seoData.title = 'Our Team of IP Specialists | SR4IPR Partners';
    seoData.meta_description = 'Meet our registered patent agents, technical draftsmen, trademark attorneys, and seasoned counsel.';
  } else if (path.startsWith('/blog')) {
    seoData.title = 'IP Law Insights & Blog | SR4IPR Partners';
    seoData.meta_description = 'Stay informed with articles, case studies, and updates on global intellectual property laws, patent filings, and trademark developments.';
  } else if (path.startsWith('/faqs')) {
    seoData.title = 'Frequently Asked Questions | SR4IPR Partners';
    seoData.meta_description = 'Get quick answers to common questions about patent requirements, trademark registration, copyright duration, and our consultation process.';
  } else if (path.startsWith('/book-consultation')) {
    seoData.title = 'Book a Consultation | SR4IPR Partners';
    seoData.meta_description = 'Schedule a secure, confidential session with our IP specialists under strict NDA to evaluate your innovations and brands.';
  } else if (path.startsWith('/contact')) {
    seoData.title = 'Contact SR4IPR Partners | Nariman Point, Mumbai';
    seoData.meta_description = 'Reach our Mumbai headquarters or London liaison office. Send your inquiries or visit us today.';
  }

  return NextResponse.json(seoData);
}
