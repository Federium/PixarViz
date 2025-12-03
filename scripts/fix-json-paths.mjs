#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const jsonPath = path.join(projectRoot, 'src/data/pixar_archivio.json');
const imagesDir = path.join(projectRoot, 'src/assets/images/personaggi');

async function fixJsonPaths() {
	try {
		console.log('📖 Lettura del JSON...');
		const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
		
		let fixedCount = 0;
		
		for (let item of data) {
			const id = item.ID;
			const folderNum = String(id).padStart(2, '0');
			const folderPath = path.join(imagesDir, folderNum);
			
			// Verifica se la cartella esiste
			try {
				await fs.access(folderPath);
			} catch {
				console.log(`⚠️  Cartella non trovata per ID ${id}`);
				continue;
			}
			
			// Lista i file nella cartella
			const files = await fs.readdir(folderPath);
			
			let updated = false;
			
			// Controlla e aggiorna Copertina
			if (!item.Copertina || item.Copertina === null) {
				const copertina = files.find(f => f.startsWith('copertina_'));
				if (copertina) {
					const ext = path.extname(copertina);
					item.Copertina = `assets/images/personaggi/${folderNum}/${path.basename(copertina, ext)}`;
					updated = true;
				}
			}
			
			// Controlla e aggiorna Poster
			if (!item.Poster || item.Poster === null) {
				const poster = files.find(f => f.startsWith('poster_'));
				if (poster) {
					const ext = path.extname(poster);
					item.Poster = `assets/images/personaggi/${folderNum}/${path.basename(poster, ext)}`;
					updated = true;
				}
			}
			
			// Controlla e aggiorna Img01-10
			// Prima trova tutti i file invz e ordinali
			const invzFiles = files
				.filter(f => f.match(/invz\d+_img_[A-Z]_\d+/))
				.sort(); // Ordina alfabeticamente
			
			for (let i = 0; i < Math.min(invzFiles.length, 10); i++) {
				const imgKey = `Img${String(i + 1).padStart(2, '0')}`;
				const invzFile = invzFiles[i];
				if (!item[imgKey] || item[imgKey] === null) {
					const ext = path.extname(invzFile);
					item[imgKey] = `assets/images/personaggi/${folderNum}/${path.basename(invzFile, ext)}`;
					updated = true;
				}
			}
			
			if (updated) {
				fixedCount++;
				console.log(`✅ Aggiornato ID ${id}: ${item['Personaggio/soggetto'] || item['Film/corto']}`);
			}
		}
		
		// Salva il JSON aggiornato
		await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
		
		console.log(`\n✅ JSON aggiornato! ${fixedCount} record corretti.`);
		
	} catch (error) {
		console.error('❌ Errore:', error.message);
		process.exit(1);
	}
}

fixJsonPaths();
