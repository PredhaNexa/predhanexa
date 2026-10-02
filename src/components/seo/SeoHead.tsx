import React, { useEffect } from 'react';
import { SeoConfig, CompanyConfig } from '../../types';

interface SeoHeadProps {
  seo: SeoConfig;
  company: CompanyConfig;
  pageTitle?: string;
  pageDescription?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  seo,
  company,
  pageTitle,
  pageDescription,
}) => {
  const title = pageTitle ? `${pageTitle} | ${company.name}` : seo.pageTitle || company.name;
  const description = pageDescription || seo.metaDescription || company.description;

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // 2. Set Standard & Open Graph Meta
    setMeta('description', description);
    setMeta('keywords', seo.keywords);
    setMeta('author', company.name);
    setMeta('robots', `${seo.robotsIndex ? 'index' : 'noindex'}, ${seo.robotsFollow ? 'follow' : 'nofollow'}`);

    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:site_name', company.name, true);
    if (seo.ogImage) setMeta('og:image', seo.ogImage, true);

    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    // 3. Google Site Verification
    if (seo.googleSiteVerification && seo.googleSiteVerification.trim() !== '') {
      setMeta('google-site-verification', seo.googleSiteVerification.trim());
    }

    // 4. Schema.org JSON-LD Structured Data (Organization)
    let scriptTag = document.getElementById('schema-org-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-org-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company.name,
      legalName: company.name,
      description: company.description,
      url: seo.canonicalUrl || 'https://predhanexa.com',
      email: company.email,
      telephone: company.phone ? `+91-${company.phone}` : undefined,
      knowsAbout: [
        'Software Development',
        'Web Application Engineering',
        'Mobile App Development',
        'API Engineering',
        'Database Architecture',
        'Software Maintenance and Support',
      ],
      address: company.address ? { '@type': 'PostalAddress', streetAddress: company.address } : undefined,
    };

    scriptTag.text = JSON.stringify(schemaData);

    // 5. Google Analytics 4 (if configured)
    if (seo.googleAnalyticsId && seo.googleAnalyticsId.trim() !== '') {
      const gaId = seo.googleAnalyticsId.trim();
      let gaScript = document.getElementById('ga-script') as HTMLScriptElement | null;
      if (!gaScript) {
        gaScript = document.createElement('script');
        gaScript.id = 'ga-script';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        const inlineGa = document.createElement('script');
        inlineGa.id = 'ga-inline';
        inlineGa.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineGa);
      }
    }
  }, [title, description, seo, company]);

  return null;
};
