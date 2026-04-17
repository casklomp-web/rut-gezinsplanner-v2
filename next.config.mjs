/** @type {import('next').NextConfig} */
const nextConfig = {
  // Geen output: 'export' voor SSR auth
  // Static export werkt niet met Supabase Auth cookies
}

export default nextConfig
