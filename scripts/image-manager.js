#!/usr/bin/env node

/**
 * One Piece Lore Map - Image Manager
 * 
 * This script helps you manage character and sub-location images:
 * - List characters/locations missing images
 * - Add image paths to JSON files
 * - Generate wiki URLs for downloading
 * - Verify image files exist
 * 
 * Usage:
 *   node scripts/image-manager.js list              # List all characters
 *   node scripts/image-manager.js missing           # List characters without images
 *   node scripts/image-manager.js locations         # List sub-locations missing images
 *   node scripts/image-manager.js verify            # Verify all image paths
 *   node scripts/image-manager.js wiki <location>   # Generate wiki URLs for characters
 *   node scripts/image-manager.js wiki-locations <location>  # Generate search URLs for sub-locations
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const DATA_DIR = path.join(__dirname, '..', 'data', 'locations');
const CHAR_IMAGE_DIR = path.join(__dirname, '..', 'public', 'images', 'characters');
const LOC_IMAGE_DIR = path.join(__dirname, '..', 'public', 'images', 'locations');
const LOCATIONS = [
  // Grand Line - Paradise
  'skypeia', 'jaya', 'long-ring-long-land', 'water-7', 'enies-lobby', 'thriller-bark', 'amazon-lily', 'impel-down', 'marineford', 'fish-man-island', 'punk-hazard', 'zou', 'whole-cake-island', 'mary-geoise', 'sea-train', 'sabaody-archipelago', 'wano', 'dressrosa', 'egghead',
  // East Blue Saga
  'dawn-island', 'shell-town', 'orange-town', 'syrup-village', 'baratie', 'arlong-park', 'loguetown',
  // Alabasta Saga
  'drum-island', 'reverse-mountain', 'whiskey-peak', 'little-garden', 'alabasta'
];

// Helper to read JSON file
function readLocationJSON(location) {
  const filePath = path.join(DATA_DIR, `${location}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${location}.json`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Helper to write JSON file
function writeLocationJSON(location, data) {
  const filePath = path.join(DATA_DIR, `${location}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Updated ${location}.json`);
}

// Helper to slugify names for file paths
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper to check if image file actually exists
function imageExists(avatarPath) {
  if (!avatarPath) return false;
  const imagePath = path.join(__dirname, '..', 'public', avatarPath);
  return fs.existsSync(imagePath);
}

// Command: List all characters
function listCharacters() {
  console.log('\n📋 All Characters by Location:\n');
  
  LOCATIONS.forEach(location => {
    const data = readLocationJSON(location);
    if (!data) return;
    
    console.log(`\n🏝️  ${data.name} (${data.notablePeople.length} characters)`);
    console.log('─'.repeat(60));
    
    data.notablePeople.forEach((person, index) => {
      const hasImage = person.avatar && imageExists(person.avatar);
      const icon = hasImage ? '✅' : '❌';
      console.log(`  ${icon} ${index + 1}. ${person.name} - ${person.role}`);
      if (person.avatar) {
        if (hasImage) {
          console.log(`     Image: ${person.avatar}`);
        } else {
          console.log(`     Image: ${person.avatar} (FILE NOT FOUND)`);
        }
      }
    });
  });
  
  console.log('\n');
}

// Command: List characters missing images
function listMissing() {
  console.log('\n🔍 Characters Missing Images:\n');
  
  let totalMissing = 0;
  
  LOCATIONS.forEach(location => {
    const data = readLocationJSON(location);
    if (!data) return;
    
    // Filter for characters without avatar OR with avatar path but file doesn't exist
    const missing = data.notablePeople.filter(p => !p.avatar || !imageExists(p.avatar));
    
    if (missing.length > 0) {
      totalMissing += missing.length;
      console.log(`\n🏝️  ${data.name} (${missing.length} missing)`);
      console.log('─'.repeat(60));
      
      missing.forEach((person, index) => {
        console.log(`  ${index + 1}. ${person.name}`);
        console.log(`     Role: ${person.role}`);
        if (person.avatar) {
          console.log(`     Path in JSON: ${person.avatar} (FILE NOT FOUND)`);
        }
        console.log(`     Suggested filename: ${slugify(person.name)}.jpg`);
      });
    }
  });
  
  console.log(`\n📊 Total characters missing images: ${totalMissing}\n`);
}

// Command: Generate wiki URLs
function generateWikiURLs(location) {
  const data = readLocationJSON(location);
  if (!data) return;
  
  console.log(`\n🔗 One Piece Wiki URLs for ${data.name}:\n`);
  console.log('Copy these URLs to download character images:');
  console.log('─'.repeat(60));
  
  data.notablePeople.forEach(person => {
    const wikiName = person.name.replace(/ /g, '_');
    const wikiURL = `https://onepiece.fandom.com/wiki/${wikiName}`;
    const hasImage = person.avatar && imageExists(person.avatar);
    const status = hasImage ? '✅' : '❌';
    
    console.log(`\n${status} ${person.name}`);
    console.log(`   ${wikiURL}`);
    console.log(`   Save as: ${slugify(person.name)}.jpg`);
  });
  
  console.log('\n');
}

// Command: List sub-locations missing images
function listLocationsMissing() {
  console.log('\n🏝️  Sub-Locations Missing Images:\n');
  
  let totalMissing = 0;
  
  LOCATIONS.forEach(location => {
    const data = readLocationJSON(location);
    if (!data) return;
    
    const subLocations = data.subLocations || [];
    const missing = subLocations.filter(loc => !loc.image || !imageExists(loc.image));
    
    if (missing.length > 0) {
      totalMissing += missing.length;
      console.log(`\n📍 ${data.name} (${missing.length} missing)`);
      console.log('─'.repeat(60));
      
      missing.forEach((loc, index) => {
        console.log(`  ${index + 1}. ${loc.name}`);
        console.log(`     Type: ${loc.type || 'N/A'}`);
        if (loc.image) {
          console.log(`     Path in JSON: ${loc.image} (FILE NOT FOUND)`);
        }
        console.log(`     Suggested filename: ${slugify(loc.name)}.jpg`);
        console.log(`     Expected path: public/images/locations/${data.slug}/${slugify(loc.name)}.jpg`);
      });
    }
  });
  
  console.log(`\n📊 Total sub-locations missing images: ${totalMissing}\n`);
}

// Command: Generate search URLs for sub-locations
function generateLocationURLs(location) {
  const data = readLocationJSON(location);
  if (!data) return;
  
  console.log(`\n🔗 Image Search URLs for ${data.name} Sub-Locations:\n`);
  console.log('Use these search URLs to find sub-location images:');
  console.log('─'.repeat(60));
  
  const subLocations = data.subLocations || [];
  
  if (subLocations.length === 0) {
    console.log('\n⚠️  No sub-locations found for this location.\n');
    return;
  }
  
  subLocations.forEach(loc => {
    const hasImage = loc.image && imageExists(loc.image);
    const status = hasImage ? '✅' : '❌';
    
    // Create search URLs for different sources
    const wikiSearchName = `${loc.name} ${data.name} One Piece`.replace(/ /g, '+');
    const googleSearch = `https://www.google.com/search?tbm=isch&q=${wikiSearchName}`;
    const wikiPage = `https://onepiece.fandom.com/wiki/${data.name.replace(/ /g, '_')}`;
    
    console.log(`\n${status} ${loc.name} (${loc.type || 'Location'})`);
    console.log(`   Google Images: ${googleSearch}`);
    console.log(`   Wiki Page: ${wikiPage}`);
    console.log(`   Save as: ${slugify(loc.name)}.jpg`);
    console.log(`   Path: public/images/locations/${data.slug}/${slugify(loc.name)}.jpg`);
  });
  
  console.log('\n');
}

// Command: Verify all image paths
function verifyImages() {
  console.log('\n🔍 Verifying Image Files:\n');
  
  let totalCharChecked = 0;
  let totalCharMissing = 0;
  let totalCharFound = 0;
  let totalLocChecked = 0;
  let totalLocMissing = 0;
  let totalLocFound = 0;
  
  LOCATIONS.forEach(location => {
    const data = readLocationJSON(location);
    if (!data) return;
    
    console.log(`\n📍 ${data.name}`);
    console.log('─'.repeat(60));
    
    // Check character images
    const withImages = data.notablePeople.filter(p => p.avatar);
    
    if (withImages.length > 0) {
      console.log('\n👥 Characters:');
      withImages.forEach(person => {
        totalCharChecked++;
        const exists = imageExists(person.avatar);
        
        if (exists) {
          totalCharFound++;
          console.log(`  ✅ ${person.name} - ${person.avatar}`);
        } else {
          totalCharMissing++;
          console.log(`  ❌ ${person.name} - ${person.avatar} (FILE NOT FOUND)`);
        }
      });
    }
    
    // Check sub-location images
    const subLocations = data.subLocations || [];
    const withLocImages = subLocations.filter(loc => loc.image);
    
    if (withLocImages.length > 0) {
      console.log('\n🏝️  Sub-Locations:');
      withLocImages.forEach(loc => {
        totalLocChecked++;
        const exists = imageExists(loc.image);
        
        if (exists) {
          totalLocFound++;
          console.log(`  ✅ ${loc.name} - ${loc.image}`);
        } else {
          totalLocMissing++;
          console.log(`  ❌ ${loc.name} - ${loc.image} (FILE NOT FOUND)`);
        }
      });
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Characters - Checked: ${totalCharChecked}, Found: ${totalCharFound}, Missing: ${totalCharMissing}`);
  console.log(`   Sub-Locations - Checked: ${totalLocChecked}, Found: ${totalLocFound}, Missing: ${totalLocMissing}`);
  console.log(`   Total - Checked: ${totalCharChecked + totalLocChecked}, Found: ${totalCharFound + totalLocFound}, Missing: ${totalCharMissing + totalLocMissing}\n`);
}

// Command: Interactive add images
async function interactiveAdd(location) {
  const data = readLocationJSON(location);
  if (!data) return;
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise(resolve => rl.question(query, resolve));
  
  console.log(`\n📸 Add Images to ${data.name}\n`);
  console.log('For each character, enter the filename (or press Enter to skip)');
  console.log('Images should be in: public/images/characters/${location}/\n');
  console.log('─'.repeat(60));
  
  let updated = 0;
  
  for (const person of data.notablePeople) {
    if (person.avatar) {
      console.log(`\n✅ ${person.name} - Already has image: ${person.avatar}`);
      continue;
    }
    
    console.log(`\n❌ ${person.name}`);
    console.log(`   Role: ${person.role}`);
    console.log(`   Suggested: ${slugify(person.name)}.jpg`);
    
    const filename = await question('   Enter filename (or press Enter to skip): ');
    
    if (filename.trim()) {
      const cleanFilename = filename.trim();
      person.avatar = `/images/characters/${location}/${cleanFilename}`;
      console.log(`   ✅ Added: ${person.avatar}`);
      updated++;
    } else {
      console.log('   ⏭️  Skipped');
    }
  }
  
  rl.close();
  
  if (updated > 0) {
    writeLocationJSON(location, data);
    console.log(`\n✅ Updated ${updated} character(s) in ${location}.json\n`);
  } else {
    console.log(`\n⏭️  No changes made\n`);
  }
}

// Command: Batch add images (assumes standard naming)
function batchAdd(location) {
  const data = readLocationJSON(location);
  if (!data) return;
  
  const locationImageDir = path.join(CHAR_IMAGE_DIR, location);
  
  if (!fs.existsSync(locationImageDir)) {
    console.error(`❌ Directory not found: ${locationImageDir}`);
    return;
  }
  
  console.log(`\n🔄 Batch Adding Images for ${data.name}\n`);
  console.log('Looking for images matching character names...');
  console.log('─'.repeat(60));
  
  let updated = 0;
  
  data.notablePeople.forEach(person => {
    if (person.avatar) {
      console.log(`✅ ${person.name} - Already has image`);
      return;
    }
    
    const slug = slugify(person.name);
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    let foundFile = null;
    for (const ext of extensions) {
      const possiblePath = path.join(locationImageDir, slug + ext);
      if (fs.existsSync(possiblePath)) {
        foundFile = slug + ext;
        break;
      }
    }
    
    if (foundFile) {
      person.avatar = `/images/characters/${location}/${foundFile}`;
      console.log(`✅ ${person.name} - Added: ${foundFile}`);
      updated++;
    } else {
      console.log(`❌ ${person.name} - No image found (expected: ${slug}.jpg)`);
    }
  });
  
  if (updated > 0) {
    writeLocationJSON(location, data);
    console.log(`\n✅ Batch updated ${updated} character(s) in ${location}.json\n`);
  } else {
    console.log(`\n⏭️  No images found to add\n`);
  }
}

// Main CLI
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  console.log('\n🗺️  One Piece Lore Map - Image Manager\n');
  
  switch (command) {
    case 'list':
      listCharacters();
      break;
      
    case 'missing':
      listMissing();
      break;
      
    case 'locations':
      listLocationsMissing();
      break;
      
    case 'wiki':
      if (!arg || !LOCATIONS.includes(arg)) {
        console.error(`❌ Please specify a valid location: ${LOCATIONS.join(', ')}`);
        process.exit(1);
      }
      generateWikiURLs(arg);
      break;
      
    case 'wiki-locations':
      if (!arg || !LOCATIONS.includes(arg)) {
        console.error(`❌ Please specify a valid location: ${LOCATIONS.join(', ')}`);
        process.exit(1);
      }
      generateLocationURLs(arg);
      break;
      
    case 'verify':
      verifyImages();
      break;
      
    case 'add':
      if (!arg || !LOCATIONS.includes(arg)) {
        console.error(`❌ Please specify a valid location: ${LOCATIONS.join(', ')}`);
        process.exit(1);
      }
      await interactiveAdd(arg);
      break;
      
    case 'batch':
      if (!arg || !LOCATIONS.includes(arg)) {
        console.error(`❌ Please specify a valid location: ${LOCATIONS.join(', ')}`);
        process.exit(1);
      }
      batchAdd(arg);
      break;
      
    default:
      console.log('Usage:');
      console.log('  Characters:');
      console.log('    node scripts/image-manager.js list                    # List all characters');
      console.log('    node scripts/image-manager.js missing                 # List characters without images');
      console.log('    node scripts/image-manager.js wiki <location>         # Generate wiki URLs for characters');
      console.log('');
      console.log('  Sub-Locations:');
      console.log('    node scripts/image-manager.js locations               # List sub-locations without images');
      console.log('    node scripts/image-manager.js wiki-locations <loc>    # Generate search URLs for sub-locations');
      console.log('');
      console.log('  General:');
      console.log('    node scripts/image-manager.js verify                  # Verify all image files exist');
      console.log('    node scripts/image-manager.js add <location>          # Interactive add images');
      console.log('    node scripts/image-manager.js batch <location>        # Auto-add images by filename');
      console.log('');
      console.log('Valid locations:');
      LOCATIONS.forEach(loc => console.log(`  - ${loc}`));
      console.log('');
      process.exit(1);
  }
}

main().catch(console.error);

