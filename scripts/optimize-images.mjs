#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Cartelle di input e output
const inputDir = path.join(projectRoot, 'src/assets/images');
const outputDir = path.join(projectRoot, 'public/images');

/**
 * Ottimizza un'immagine
 */
async function optimizeImage(inputPath, outputPath) {
	try {
		const filename = path.basename(inputPath);
		const ext = path.extname(filename).toLowerCase();
		const nameWithoutExt = path.basename(filename, ext);

		console.log(`Ottimizzazione di ${filename}...`);

		// Crea versione WebP ottimizzata
		await sharp(inputPath)
			.resize(1600, 1200, {
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({ quality: 85 })
			.toFile(path.join(outputDir, `${nameWithoutExt}.webp`));

		// Crea versione JPG ottimizzata (fallback)
		await sharp(inputPath)
			.resize(1600, 1200, {
				fit: 'inside',
				withoutEnlargement: true
			})
			.jpeg({ quality: 85, progressive: true })
			.toFile(path.join(outputDir, `${nameWithoutExt}.jpg`));

		console.log(`✅ ${filename} ottimizzata`);
	} catch (error) {
		console.error(`❌ Errore nell'ottimizzazione di ${path.basename(inputPath)}:`, error.message);
	}
}

/**
 * Processa tutte le immagini nella cartella di input
 */
async function processAllImages() {
	try {
		// Assicurati che la cartella di output esista
		await fs.mkdir(outputDir, { recursive: true });

		// Leggi tutti i file dalla cartella di input
		const files = await fs.readdir(inputDir);

		// Filtra solo le immagini
		const imageFiles = files.filter(file => {
			const ext = path.extname(file).toLowerCase();
			return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
		});

		console.log(`Trovate ${imageFiles.length} immagini da ottimizzare\n`);

		// Ottimizza tutte le immagini
		for (const file of imageFiles) {
			const inputPath = path.join(inputDir, file);
			const outputPath = path.join(outputDir, file);
			await optimizeImage(inputPath, outputPath);
		}

		console.log(`\n✅ Tutte le immagini sono state ottimizzate!`);
		console.log(`Immagini salvate in: ${outputDir}`);
	} catch (error) {
		console.error('❌ Errore durante l\'ottimizzazione:', error.message);
		process.exit(1);
	}
}

// Esegui lo script
processAllImages();
