import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Article } from '../types';

interface BlogSEOProps {
  article: Article;
}

export function BlogSEO({ article }: BlogSEOProps) {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/article/${article.id}` : `https://elawyersbd.com/blog/${article.id}`;
  const siteName = 'E-Lawyers';
  
  // Default image fallback if not provided
  const imageUrl = article.imageUrl ? (
    article.imageUrl.startsWith('http') ? article.imageUrl : `${typeof window !== 'undefined' ? window.location.origin : 'https://elawyersbd.com'}${article.imageUrl}`
  ) : 'https://elawyersbd.com/logo.png';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.metaTitle || article.title,
    "description": article.metaDescription || article.excerpt,
    "author": {
      "@type": "Organization",
      "name": article.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": "https://elawyersbd.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "image": imageUrl
  };

  const legalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "E-Lawyers",
    "url": "https://elawyersbd.com",
    "telephone": "+8801335230170",
    "email": "info@elawyersbd.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "G-5, BTI Centara Grand, 144-144/1 Green Road",
      "addressLocality": "Dhaka",
      "postalCode": "1205",
      "addressCountry": "BD"
    }
  };

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{article.metaTitle || article.title}</title>
      <meta name="description" content={article.metaDescription || article.excerpt} />
      {article.tags && <meta name="keywords" content={article.tags.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={article.metaTitle || article.title} />
      <meta property="og:description" content={article.metaDescription || article.excerpt} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="article:author" content={article.author.name} />
      <meta property="article:section" content={article.category} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.metaTitle || article.title} />
      <meta name="twitter:description" content={article.metaDescription || article.excerpt} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(legalServiceSchema)}
      </script>
    </Helmet>
  );
}
