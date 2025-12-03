#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const jsonPath = path.join(projectRoot, 'src/data/pixar_archivio.json');
const imagesDir = path.join(projectRoot, 'src/assets/images/personaggi');

async function rebuildJsonPaths() {
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
			
			// Trova e aggiorna Copertina
			const copertina = files.find(f => f.startsWith('copertina_'));
			if (copertina) {
				const ext = path.extname(copertina);
				const newPath = `assets/images/personaggi/${folderNum}/${path.basename(copertina, ext)}`;
				if (item.Copertina !== newPath) {
					item.Copertina = newPath;
					updated = true;
				}
			} else {
				item.Copertina = null;
			}
			
			// Trova e aggiorna Poster
			const poster = files.find(f => f.startsWith('poster_'));
			if (poster) {
				const ext = path.extname(poster);
				const newPath = `assets/images/personaggi/${folderNum}/${path.basename(poster, ext)}`;
				if (item.Poster !== newPath) {
					item.Poster = newPath;
					updated = true;
				}
			} else {
				item.Poster = null;
			}
			
			// Trova tutti i file invz e ordinali
			const invzFiles = files
				.filter(f => f.match(/invz\d+_img_[A-Z]_\d+/))
				.sort();
			
			// Aggiorna Img01-10
			for (let i = 1; i <= 10; i++) {
				const imgKey = `Img${String(i).padStart(2, '0')}`;
				
				if (i <= invzFiles.length) {
					const invzFile = invzFiles[i - 1];
					const ext = path.extname(invzFile);
					const newPath = `assets/images/personaggi/${folderNum}/${path.basename(invzFile, ext)}`;
					if (item[imgKey] !== newPath) {
						item[imgKey] = newPath;
						updated = true;
					}
				} else {
					if (item[imgKey] !== null) {
						item[imgKey] = null;
						updated = true;
					}
				}
			}
			
			if (updated) {
				fixedCount++;
				console.log(`✅ Aggiornato ID ${id}: ${item['Personaggio/soggetto'] || item['Film/corto']}`);
			}
		}
		
		// Salva il JSON aggiornato
		await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
		
		console.log(`\n✅ JSON ricostruito! ${fixedCount} record aggiornati.`);
		
	} catch (error) {
		console.error('❌ Errore:', error.message);
		console.error(error);
		process.exit(1);
	}
}

rebuildJsonPaths();
