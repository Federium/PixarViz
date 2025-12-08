# Ottimizzazione Immagini - PixarViz

## Come funziona

Le immagini in questo progetto vengono ottimizzate utilizzando due approcci complementari:

### 1. Copertine (Gallery 3D con Three.js)
- Le copertine originali vanno in `/src/assets/images/personaggi/XX/copertina_XX.jpg`
- Esegui `npm run optimize-images` per ottimizzare solo le copertine
- Le versioni ottimizzate (WebP + JPG) vengono salvate in `/public/images/`
- Three.js carica le copertine WebP dalla cartella public per migliori performance

### 2. Altre Immagini (Poster, dettagli, ecc.)
- Tutte le altre immagini in `/src/assets/images/` vengono gestite da Astro
- Astro utilizza il componente `<Image />` con import dinamici
- Ottimizzazione automatica al build con formati multipli (WebP, AVIF)
- Dimensioni responsive generate automaticamente

## Comandi

```bash
# Ottimizza solo le copertine per la gallery 3D
npm run optimize-images

# Build con ottimizzazione automatica di tutte le altre immagini
npm run build

# Dev (senza ottimizzazione)
npm run dev
```

## Struttura Cartelle

```
/src/assets/images/personaggi/XX/
  ├── copertina_XX.jpg    <- Viene ottimizzata manualmente → /public/images/
  ├── poster_XX.jpg       <- Ottimizzata da Astro al build
  └── invz_img_*.jpg      <- Ottimizzate da Astro al build

/public/images/           <- Solo copertine ottimizzate (generate da script)
```

## Aggiungere Nuove Immagini

### Per le Copertine (Gallery 3D):
## Formati Generati

### Copertine (script manuale):
- **WebP**: Per browser moderni (migliore compressione)
- **JPG**: Fallback per compatibilità
- **Dimensioni**: Ridimensionate a max 1600x1200px
- **Qualità**: 85% (ottimo compromesso qualità/dimensione)

### Altre immagini (Astro automatico):
- **AVIF + WebP + formati originali**: Gestione automatica
- **Dimensioni responsive**: Multiple breakpoint
- **Lazy loading**: Integrato
1. Aggiungi le immagini in `/src/assets/images/personaggi/XX/`
2. Non serve ottimizzazione manuale - Astro le gestisce al build
3. Aggiorna `pixar_archivio.json` per puntare alle nuove immagini

## Formati Generati

- **WebP**: Per browser moderni (migliore compressione)
- **JPG**: Fallback per compatibilità
- **Dimensioni**: Ridimensionate a max 1600x1200px
- **Qualità**: 85% (ottimo compromesso qualità/dimensione)
