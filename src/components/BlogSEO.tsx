import React from 'react';
import { Article } from '../types';
import { ArticleSEO, SEO, ServiceSEO } from './SEO';

export interface BlogSEOProps {
  article: Article;
  canonicalUrl?: string;
  siteName?: string;
}

export function BlogSEO({ article, canonicalUrl, siteName }: BlogSEOProps) {
  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'E-Lawyers & Accounticca',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://accounticca.com',
    telephone: '+8801335230170',
    email: 'info@accounticca.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'G-5, BTI Centara Grand, 144-144/1 Green Road',
      addressLocality: 'Dhaka',
      postalCode: '1205',
      addressCountry: 'BD'
    }
  };

  return (
    <ArticleSEO
      article={article}
      canonicalUrl={canonicalUrl}
      siteName={siteName}
      customSchema={legalServiceSchema}
    />
  );
}

// Re-export core SEO utilities from this file as well for convenience
export { SEO, ArticleSEO, ServiceSEO };
