# Ottimizzazione Immagini - PixarViz

## Come funziona

Le immagini in questo progetto vengono ottimizzate automaticamente utilizzando due approcci:

### 1. Per la Gallery 3D (Three.js)
- Le immagini originali vanno in `/src/assets/images/`
- Esegui `npm run optimize-images` per creare versioni ottimizzate
- Le versioni ottimizzate (WebP + JPG) vengono salvate in `/public/images/`
- Three.js carica le immagini WebP per migliori performance

### 2. Per le Pagine di Dettaglio
- Astro utilizza il componente `<Image />` con import dinamici
- Le immagini in `/src/assets/images/` vengono automaticamente ottimizzate al build
- Astro genera più formati (WebP, AVIF) e dimensioni responsive

## Comandi

```bash
# Ottimizza manualmente le immagini
npm run optimize-images

# Build con ottimizzazione automatica
npm run build

# Dev (senza ottimizzazione)
npm run dev
```

## Struttura Cartelle

```
/src/assets/images/     <- Immagini originali (alta qualità)
/public/images/         <- Immagini ottimizzate (generate automaticamente)
```

## Aggiungere Nuove Immagini

1. Metti le immagini originali in `/src/assets/images/`
2. Esegui `npm run optimize-images`
3. Le immagini ottimizzate saranno disponibili in `/public/images/`
4. Aggiorna i file JSON per puntare alle nuove immagini

## Formati Generati

- **WebP**: Per browser moderni (migliore compressione)
- **JPG**: Fallback per compatibilità
- **Dimensioni**: Ridimensionate a max 1600x1200px
- **Qualità**: 85% (ottimo compromesso qualità/dimensione)
