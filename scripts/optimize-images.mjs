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
 * Processa ricorsivamente solo le copertine nelle sottocartelle
 */
async function processDirectory(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const imageFiles = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			// Ricorsione nelle sottocartelle
			const subImages = await processDirectory(fullPath);
			imageFiles.push(...subImages);
		} else if (entry.isFile()) {
			// Controlla se è una copertina
			const ext = path.extname(entry.name).toLowerCase();
			const filename = path.basename(entry.name, ext).toLowerCase();
			if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext) && filename.startsWith('copertina')) {
				imageFiles.push(fullPath);
			}
		}
	}

	return imageFiles;
}

/**
 * Processa tutte le immagini nella cartella di input
 */
async function processAllImages() {
	try {
		// Assicurati che la cartella di output esista
		await fs.mkdir(outputDir, { recursive: true });

		// Trova tutte le copertine ricorsivamente
		const imageFiles = await processDirectory(inputDir);

		console.log(`Trovate ${imageFiles.length} copertine da ottimizzare\n`);

		// Ottimizza tutte le immagini
		for (const inputPath of imageFiles) {
			await optimizeImage(inputPath, outputDir);
		}

		console.log(`\n✅ Tutte le copertine sono state ottimizzate!`);
		console.log(`Copertine salvate in: ${outputDir}`);
		console.log(`Le altre immagini verranno ottimizzate automaticamente da Astro al build.`);
	} catch (error) {
		console.error('❌ Errore durante l\'ottimizzazione:', error.message);
		process.exit(1);
	}
}

// Esegui lo script
processAllImages();
