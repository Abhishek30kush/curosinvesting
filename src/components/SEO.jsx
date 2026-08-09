import React, { useEffect } from 'react';

export const SEO = ({
  title = "Curos Investing | Financial News, Crypto & Market Intelligence",
  description = "Premium financial news, expert stock market analysis, crypto updates, and macro-economic intelligence for modern investors.",
  keywords = "investing, stock market, crypto, bitcoin, economy, financial news, market analysis, Curos Investing",
  image = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
  url = window.location.href,
  type = "website",
  articleData = null,
  schema = null
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(`meta[${selector}="${attributeName}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(selector, attributeName);
        document.head.appendChild(element);
      }
      element.setAttribute(attributeValue, content);
    };

    // 2. Standard Meta Tags
    updateMetaTag('name', 'description', 'content', description);
    updateMetaTag('name', 'keywords', 'content', keywords);
    updateMetaTag('name', 'robots', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('name', 'author', 'content', 'Curos Financial Research Team');

    // 3. Open Graph (OG) Meta Tags
    updateMetaTag('property', 'og:title', 'content', title);
    updateMetaTag('property', 'og:description', 'content', description);
    updateMetaTag('property', 'og:image', 'content', image);
    updateMetaTag('property', 'og:url', 'content', url);
    updateMetaTag('property', 'og:type', 'content', type);
    updateMetaTag('property', 'og:site_name', 'content', 'Curos Investing');

    // 4. Twitter Card Meta Tags
    updateMetaTag('name', 'twitter:card', 'content', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', 'content', title);
    updateMetaTag('name', 'twitter:description', 'content', description);
    updateMetaTag('name', 'twitter:image', 'content', image);

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);

    // 6. Schema.org Structured Data (JSON-LD) for SEO & AI Search Engines
    let scriptTag = document.getElementById('json-ld-schema');
    if (scriptTag) {
      scriptTag.remove();
    }

    const defaultSchema = schema || (type === 'article' && articleData ? {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": articleData.title || title,
      "description": articleData.excerpt || description,
      "image": [articleData.coverImage || image],
      "datePublished": articleData.date || new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "author": [{
        "@type": "Organization",
        "name": articleData.author || "Curos Financial Research Team",
        "url": "https://curosinvesting.vercel.app/about"
      }],
      "publisher": {
        "@type": "Organization",
        "name": "Curos Investing",
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    } : {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Curos Investing",
      "url": "https://curosinvesting.vercel.app/",
      "description": description,
      "publisher": {
        "@type": "Organization",
        "name": "Curos Investing"
      }
    });

    scriptTag = document.createElement('script');
    scriptTag.id = 'json-ld-schema';
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(defaultSchema);
    document.head.appendChild(scriptTag);

  }, [title, description, keywords, image, url, type, articleData, schema]);

  return null;
};
