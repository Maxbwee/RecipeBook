import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recipe Book',
    short_name: 'RecipeBook',
    description: 'A Progressive Web App built for Recipe Book',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/cookbook-small.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/cookbook-large.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}