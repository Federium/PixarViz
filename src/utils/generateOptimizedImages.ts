// Utility per generare URL di immagini ottimizzate per Three.js
// Questo script viene eseguito al build time per pre-generare immagini ottimizzate

export interface ImageData {
	ID: number;
	NAME: string;
	SRC: string;
	CATEGORY: string;
	optimizedSrc?: string;
}

/**
 * Prepara i dati delle immagini con percorsi ottimizzati
 * Usa immagini WebP quando disponibili per migliori performance
 */
export function prepareImageData(galleryData: ImageData[]): ImageData[] {
	return galleryData.map((item: ImageData) => {
		// Estrai il nome del file senza estensione
		const filename = item.SRC.split('/').pop() || '';
		const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
		
		return {
			...item,
			// Usa WebP per Three.js (migliore compressione e performance)
			// Lo script optimize-images.mjs crea automaticamente versioni .webp
			optimizedSrc: `/images/${nameWithoutExt}.webp`,
		};
	});
}
