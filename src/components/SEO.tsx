import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Article } from '../types';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ServiceSEOConfig {
  serviceType: string;
  providerName?: string;
  providerType?: 'LegalService' | 'AccountingService' | 'ProfessionalService' | 'Organization';
  providerUrl?: string;
  areaServed?: string;
  serviceAudience?: string;
  telephone?: string;
  email?: string;
}

export interface SEOProps {
  /** Page or Content Title */
  title: string;
  /** Meta Description (recommended 120-160 characters) */
  description?: string;
  /** Canonical URL or relative path (e.g. /tools or https://example.com/tools) */
  canonicalUrl?: string;
  /** Page Type: website, article, or service */
  type?: 'website' | 'article' | 'service';
  /** Featured image URL for Open Graph and Twitter Card */
  imageUrl?: string;
  /** Image Alt text */
  imageAlt?: string;
  /** Keywords list or comma-separated string */
  keywords?: string[] | string;
  /** Prevent search engines from indexing this page */
  noindex?: boolean;
  /** Brand / Site Name override */
  siteName?: string;
  /** Twitter handle (e.g. @Accounticca) */
  twitterHandle?: string;
  /** Author name for article */
  authorName?: string;
  /** Author URL */
  authorUrl?: string;
  /** Publication date (ISO format) */
  publishedTime?: string;
  /** Modification date (ISO format) */
  modifiedTime?: string;
  /** Article category / section */
  section?: string;
  /** Article tags */
  tags?: string[];
  /** Service specific configuration */
  service?: ServiceSEOConfig;
  /** Optional breadcrumbs for Schema.org BreadcrumbList */
  breadcrumbs?: BreadcrumbItem[];
  /** Custom Schema.org object or array of objects to inject */
  customSchema?: Record<string, any> | Array<Record<string, any>>;
  /** Optional children for arbitrary extra meta tags */
  children?: React.ReactNode;
}

const DEFAULT_SITE_NAME = 'Accounticca & E-Lawyers Compliance Hub';
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200';
const DEFAULT_FALLBACK_BASE_URL = 'https://accounticca.com';

/**
 * Resolves a full canonical URL from either relative path or absolute URL
 */
function resolveCanonicalUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '') || window.location.origin;
    }
    return DEFAULT_FALLBACK_BASE_URL;
  }

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl.replace(/\/$/, '');
  }

  const base = typeof window !== 'undefined' ? window.location.origin : DEFAULT_FALLBACK_BASE_URL;
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${cleanPath}`.replace(/\/$/, '') || base;
}

/**
 * Resolves an absolute image URL
 */
function resolveImageUrl(img?: string): string {
  if (!img) return DEFAULT_FALLBACK_IMAGE;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const base = typeof window !== 'undefined' ? window.location.origin : DEFAULT_FALLBACK_BASE_URL;
  return `${base}${img.startsWith('/') ? img : `/${img}`}`;
}

/**
 * Universal, Reusable SEO Component
 * Automatically injects:
 * - HTML Title & Meta Description
 * - Dynamic Canonical URLs (<link rel="canonical" />)
 * - Open Graph Tags (Facebook, LinkedIn, Discord, Slack)
 * - Twitter / X Cards
 * - Schema.org JSON-LD Structured Data (Article, Service, BreadcrumbList, WebPage)
 */
export function SEO({
  title,
  description = 'Legal, Tax, VAT, Accounting & Business Technology Knowledge Platform for Bangladesh by Accounticca & E-Lawyers.',
  canonicalUrl,
  type = 'website',
  imageUrl,
  imageAlt,
  keywords,
  noindex = false,
  siteName = DEFAULT_SITE_NAME,
  twitterHandle = '@Accounticca',
  authorName,
  authorUrl,
  publishedTime,
  modifiedTime,
  section,
  tags,
  service,
  breadcrumbs,
  customSchema,
  children
}: SEOProps) {
  const fullCanonicalUrl = useMemo(() => resolveCanonicalUrl(canonicalUrl), [canonicalUrl]);
  const fullImageUrl = useMemo(() => resolveImageUrl(imageUrl), [imageUrl]);

  const formattedKeywords = useMemo(() => {
    if (!keywords) return undefined;
    if (Array.isArray(keywords)) return keywords.join(', ');
    return keywords;
  }, [keywords]);

  // Generate Schemas
  const structuredDataList = useMemo(() => {
    const list: Record<string, any>[] = [];

    // 1. Article Schema
    if (type === 'article') {
      const articleSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: fullImageUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullCanonicalUrl
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: resolveImageUrl('/logo.png')
          }
        }
      };

      if (publishedTime) articleSchema.datePublished = publishedTime;
      if (modifiedTime || publishedTime) articleSchema.dateModified = modifiedTime || publishedTime;

      if (authorName) {
        articleSchema.author = {
          '@type': 'Person',
          name: authorName,
          ...(authorUrl ? { url: authorUrl } : {})
        };
      }

      if (tags && tags.length > 0) {
        articleSchema.keywords = tags.join(', ');
      }

      list.push(articleSchema);
    }

    // 2. Service Schema
    if (type === 'service' || service) {
      const providerType = service?.providerType || 'ProfessionalService';
      const serviceSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': providerType,
        name: service?.providerName || title,
        description: description,
        url: fullCanonicalUrl,
        image: fullImageUrl,
        serviceType: service?.serviceType || title,
        areaServed: {
          '@type': 'Country',
          name: service?.areaServed || 'Bangladesh'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'G-5, BTI Centara Grand, 144-144/1 Green Road',
          addressLocality: 'Dhaka',
          postalCode: '1205',
          addressCountry: 'BD'
        },
        telephone: service?.telephone || '+8801335230170',
        email: service?.email || 'info@accounticca.com'
      };

      if (service?.serviceAudience) {
        serviceSchema.audience = {
          '@type': 'Audience',
          audienceType: service.serviceAudience
        };
      }

      list.push(serviceSchema);
    }

    // 3. Breadcrumbs Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      list.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: resolveCanonicalUrl(crumb.url)
        }))
      });
    }

    // 4. Custom Schema
    if (customSchema) {
      if (Array.isArray(customSchema)) {
        list.push(...customSchema);
      } else {
        list.push(customSchema);
      }
    }

    return list;
  }, [
    type,
    title,
    description,
    fullCanonicalUrl,
    fullImageUrl,
    siteName,
    publishedTime,
    modifiedTime,
    authorName,
    authorUrl,
    tags,
    service,
    breadcrumbs,
    customSchema
  ]);

  const ogType = type === 'article' ? 'article' : 'website';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {formattedKeywords && <meta name="keywords" content={formattedKeywords} />}
      {authorName && <meta name="author" content={authorName} />}
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        }
      />

      {/* Canonical Link */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Article Specific Open Graph */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && authorName && (
        <meta property="article:author" content={authorName} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' &&
        tags &&
        tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {/* Schema.org Structured Data */}
      {structuredDataList.map((data, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}

      {children}
    </Helmet>
  );
}

/**
 * Dedicated Blog Article SEO Helper Component
 */
export interface ArticleSEOProps {
  article: Article;
  canonicalUrl?: string;
  siteName?: string;
  customSchema?: Record<string, any> | Array<Record<string, any>>;
}

export function ArticleSEO({
  article,
  canonicalUrl,
  siteName,
  customSchema
}: ArticleSEOProps) {
  const resolvedCanonical = canonicalUrl || `/article/${article.id}`;
  const displayTitle = article.metaTitle || article.title;
  const displayDesc = article.metaDescription || article.excerpt;

  return (
    <SEO
      title={displayTitle}
      description={displayDesc}
      canonicalUrl={resolvedCanonical}
      type="article"
      imageUrl={article.imageUrl}
      keywords={article.tags}
      authorName={article.author.name}
      publishedTime={article.publishedAt}
      section={article.category}
      tags={article.tags}
      siteName={siteName}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: article.category, url: `/category/${article.categoryId}` },
        { name: article.title, url: resolvedCanonical }
      ]}
      customSchema={customSchema}
    />
  );
}

/**
 * Dedicated Service Page SEO Helper Component
 */
export interface ServiceSEOProps {
  title: string;
  description: string;
  serviceType: string;
  canonicalUrl?: string;
  imageUrl?: string;
  providerName?: string;
  providerType?: 'LegalService' | 'AccountingService' | 'ProfessionalService' | 'Organization';
  areaServed?: string;
  keywords?: string[] | string;
  breadcrumbs?: BreadcrumbItem[];
  customSchema?: Record<string, any> | Array<Record<string, any>>;
}

export function ServiceSEO({
  title,
  description,
  serviceType,
  canonicalUrl,
  imageUrl,
  providerName = 'Accounticca & E-Lawyers',
  providerType = 'ProfessionalService',
  areaServed = 'Bangladesh',
  keywords,
  breadcrumbs,
  customSchema
}: ServiceSEOProps) {
  return (
    <SEO
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      type="service"
      imageUrl={imageUrl}
      keywords={keywords}
      service={{
        serviceType,
        providerName,
        providerType,
        areaServed
      }}
      breadcrumbs={breadcrumbs}
      customSchema={customSchema}
    />
  );
}
