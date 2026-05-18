
import { Helmet } from "react-helmet-async";

const SEOHead = ({ 
  title, 
  description, 
  image, 
  slug = "", 
  article = false 
}) => {
  const siteTitle = "Modern Blog";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = description || "A modern, fast, and SEO-optimized blogging platform.";
  const siteUrl = window.location.origin;
  const fullUrl = `${siteUrl}${slug ? `/${slug}` : ""}`;
  const ogImage = image || `${siteUrl}/favicon.svg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHead;
