#!/usr/bin/env node

/**
 * Script per convertire i font OTF in WOFF2 usando fonttools
 * Richiede: pip install fonttools brotli
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontsDir = path.join(__dirname, '../src/assets/Fonts');
const outputDir = path.join(__dirname, '../public/fonts');

async function checkDependencies() {
	try {
		await execAsync('python3 -m fontTools.subset --help');
		console.log('✅ fonttools installato');
		return true;
	} catch (error) {
		console.error('❌ fonttools non trovato. Installa con:');
		console.error('   pip install fonttools brotli');
		console.error('   oppure: pip3 install fonttools brotli');
		return false;
	}
}

async function convertFont(inputPath, outputPath) {
	const command = `python3 -m fontTools.subset "${inputPath}" --output-file="${outputPath}" --flavor=woff2 --layout-features="*" --unicodes="*"`;
	
	try {
		await execAsync(command);
		return true;
	} catch (error) {
		console.error(`❌ Errore conversione ${path.basename(inputPath)}:`, error.message);
		return false;
	}
}

async function main() {
	console.log('🔄 Conversione font OTF → WOFF2\n');
	
	// Controlla dipendenze
	const hasTools = await checkDependencies();
	if (!hasTools) {
		process.exit(1);
	}
	
	// Crea cartella output se non esiste
	if (!existsSync(outputDir)) {
		await mkdir(outputDir, { recursive: true });
		console.log(`📁 Creata cartella: ${outputDir}\n`);
	}
	
	// Leggi tutti i file OTF
	const files = await readdir(fontsDir);
	const otfFiles = files.filter(f => f.endsWith('.otf'));
	
	if (otfFiles.length === 0) {
		console.log('⚠️  Nessun file OTF trovato');
		return;
	}
	
	console.log(`📝 Trovati ${otfFiles.length} font OTF\n`);
	
	let converted = 0;
	let skipped = 0;
	
	for (const file of otfFiles) {
		const inputPath = path.join(fontsDir, file);
		const outputFile = file.replace('.otf', '.woff2');
		const outputPath = path.join(outputDir, outputFile);
		
		// Controlla se già esiste
		if (existsSync(outputPath)) {
			console.log(`⏭️  Saltato: ${file} (già convertito)`);
			skipped++;
			continue;
		}
		
		console.log(`🔄 Conversione: ${file}...`);
		const success = await convertFont(inputPath, outputPath);
		
		if (success) {
			console.log(`✅ Creato: ${outputFile}\n`);
			converted++;
		}
	}
	
	console.log('\n📊 Riepilogo:');
	console.log(`   Convertiti: ${converted}`);
	console.log(`   Saltati: ${skipped}`);
	console.log(`   Totali: ${otfFiles.length}`);
	
	if (converted > 0) {
		console.log('\n✨ Conversione completata!');
		console.log('💡 Ricorda di aggiornare i @font-face in style.css');
	}
}

main().catch(console.error);
