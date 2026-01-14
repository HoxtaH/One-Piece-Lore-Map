#!/usr/bin/env node

/**
 * Batch Image Processing Script
 * 
 * This script automatically adds images to characters and sub-locations in your location JSON files.
 * 
 * Usage:
 *   node scripts/add-images.js                    # Dry run (preview changes)
 *   node scripts/add-images.js --apply            # Apply changes
 *   node scripts/add-images.js --location drum-island # Process only one location
 *   node scripts/add-images.js --saga alabasta    # Process entire saga
 *   node scripts/add-images.js --type characters  # Process only character images
 *   node scripts/add-images.js --type locations   # Process only location images
 * 
 * Image Naming Convention:
 *   Characters:
 *     - Save as: character-name.jpg (e.g., "monkey-d-luffy.jpg", "chopper.jpg")
 *     - Place in: public/images/characters/[location-slug]/
 *   Locations/Sub-locations:
 *     - Save as: location-name.jpg (e.g., "drum-castle.jpg", "bighorn-village.jpg")
 *     - Place in: public/images/locations/[location-slug]/
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_DIR = path.join(process.cwd(), 'data', 'locations');
const CHAR_IMAGES_BASE = '/images/characters'; // Public URL path for characters
const CHAR_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'characters');
const LOC_IMAGES_BASE = '/images/locations'; // Public URL path for locations
const LOC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'locations');

// Saga definitions for batch processing
const SAGAS = {
  'east-blue': ['dawn-island', 'shell-town', 'orange-town', 'syrup-village', 'baratie', 'arlong-park', 'loguetown'],
  'alabasta': ['reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island', 'alabasta'],
  'paradise': ['skypeia', 'sabaody-archipelago', 'dressrosa'],
  'new-world': ['wano', 'egghead']
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = !args.includes('--apply');
const targetLocation = args.find(arg => arg.startsWith('--location'))?.split('=')[1];
const targetSaga = args.find(arg => arg.startsWith('--saga'))?.split('=')[1];
const targetType = args.find(arg => arg.startsWith('--type'))?.split('=')[1] || 'all'; // 'characters', 'locations', or 'all'

/**
 * Normalize a name for comparison (lowercase, remove special chars)
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/\./g, '') // Remove periods
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove other special chars
}

/**
 * Find image file for a character
 */
function findImageForCharacter(characterName, locationSlug) {
  const locationImagesDir = path.join(CHAR_IMAGES_DIR, locationSlug);
  
  if (!fs.existsSync(locationImagesDir)) {
    return null;
  }

  const files = fs.readdirSync(locationImagesDir);
  const normalizedCharName = normalizeName(characterName);

  // Look for exact match or close match
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      continue;
    }

    const nameWithoutExt = path.basename(file, ext);
    const normalizedFileName = normalizeName(nameWithoutExt);

    if (normalizedFileName === normalizedCharName) {
      return `${CHAR_IMAGES_BASE}/${locationSlug}/${file}`;
    }
  }

  return null;
}

/**
 * Find image file for a sub-location
 */
function findImageForSubLocation(subLocationName, locationSlug) {
  const locationImagesDir = path.join(LOC_IMAGES_DIR, locationSlug);
  
  if (!fs.existsSync(locationImagesDir)) {
    return null;
  }

  const files = fs.readdirSync(locationImagesDir);
  const normalizedName = normalizeName(subLocationName);

  // Look for exact match
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      continue;
    }

    const nameWithoutExt = path.basename(file, ext);
    const normalizedFileName = normalizeName(nameWithoutExt);

    if (normalizedFileName === normalizedName) {
      return `${LOC_IMAGES_BASE}/${locationSlug}/${file}`;
    }
  }

  return null;
}

/**
 * Process a single location JSON file
 */
function processLocation(locationFile) {
  const locationPath = path.join(DATA_DIR, locationFile);
  
  if (!fs.existsSync(locationPath)) {
    console.log(`⚠️  Skipping ${locationFile} - file not found (may not be created yet)`);
    return { location: null, changes: [], locationPath: null };
  }
  
  const location = JSON.parse(fs.readFileSync(locationPath, 'utf-8'));
  const locationSlug = location.slug;

  console.log(`\n📍 Processing: ${location.name} (${locationSlug})`);
  console.log('─'.repeat(60));

  const changes = [];
  
  // Process character images
  if (targetType === 'all' || targetType === 'characters') {
    console.log('\n👥 Processing character images...');
    const charChanges = processCharacterImages(location, locationSlug);
    changes.push(...charChanges);
  }
  
  // Process sub-location images
  if (targetType === 'all' || targetType === 'locations') {
    console.log('\n🏝️  Processing sub-location images...');
    const locChanges = processSubLocationImages(location, locationSlug);
    changes.push(...locChanges);
  }

  return { location, changes, locationPath };
}

/**
 * Process character images for a location
 */
function processCharacterImages(location, locationSlug) {
  const changes = [];
  
  if (!location.notablePeople || location.notablePeople.length === 0) {
    console.log('  ⚠️  No characters found in this location');
    return changes;
  }

  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  location.notablePeople.forEach((character, index) => {
    const imagePath = findImageForCharacter(character.name, locationSlug);

    if (character.avatar) {
      console.log(`  ⏭️  ${character.name} - Already has avatar: ${character.avatar}`);
      skippedCount++;
    } else if (imagePath) {
      console.log(`  ✅ ${character.name} - Found: ${imagePath}`);
      location.notablePeople[index].avatar = imagePath;
      changes.push({ type: 'character', name: character.name, path: imagePath });
      updatedCount++;
    } else {
      console.log(`  ❌ ${character.name} - No image found`);
      console.log(`     Expected: public/images/characters/${locationSlug}/${normalizeName(character.name)}.jpg`);
      notFoundCount++;
    }
  });

  console.log(`  Summary: ✅ ${updatedCount} added | ⏭️  ${skippedCount} skipped | ❌ ${notFoundCount} not found`);
  
  return changes;
}

/**
 * Process sub-location images for a location
 */
function processSubLocationImages(location, locationSlug) {
  const changes = [];
  
  if (!location.subLocations || location.subLocations.length === 0) {
    console.log('  ⚠️  No sub-locations found in this location');
    return changes;
  }

  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  location.subLocations.forEach((subLoc, index) => {
    const imagePath = findImageForSubLocation(subLoc.name, locationSlug);

    if (subLoc.image) {
      console.log(`  ⏭️  ${subLoc.name} - Already has image: ${subLoc.image}`);
      skippedCount++;
    } else if (imagePath) {
      console.log(`  ✅ ${subLoc.name} - Found: ${imagePath}`);
      location.subLocations[index].image = imagePath;
      changes.push({ type: 'sub-location', name: subLoc.name, path: imagePath });
      updatedCount++;
    } else {
      console.log(`  ❌ ${subLoc.name} - No image found`);
      console.log(`     Expected: public/images/locations/${locationSlug}/${normalizeName(subLoc.name)}.jpg`);
      notFoundCount++;
    }
  });

  console.log(`  Summary: ✅ ${updatedCount} added | ⏭️  ${skippedCount} skipped | ❌ ${notFoundCount} not found`);
  
  return changes;
}

/**
 * Main execution
 */
function main() {
  console.log('🖼️  One Piece Lore Map - Batch Image Processor\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified');
    console.log('   Run with --apply to save changes\n');
  } else {
    console.log('💾 APPLY MODE - Files will be updated\n');
  }
  
  // Show what type we're processing
  if (targetType === 'characters') {
    console.log('🎯 Processing: CHARACTER IMAGES ONLY\n');
  } else if (targetType === 'locations') {
    console.log('🎯 Processing: SUB-LOCATION IMAGES ONLY\n');
  } else {
    console.log('🎯 Processing: BOTH CHARACTERS AND SUB-LOCATIONS\n');
  }

  // Determine which locations to process
  let locationsToProcess = [];
  
  if (targetLocation) {
    console.log(`🎯 Processing single location: ${targetLocation}\n`);
    locationsToProcess = [`${targetLocation}.json`];
  } else if (targetSaga) {
    const sagaLocations = SAGAS[targetSaga];
    if (!sagaLocations) {
      console.error(`❌ Unknown saga: ${targetSaga}`);
      console.error(`   Available sagas: ${Object.keys(SAGAS).join(', ')}`);
      process.exit(1);
    }
    console.log(`🏴‍☠️ Processing ${targetSaga.toUpperCase()} SAGA:\n`);
    locationsToProcess = sagaLocations.map(loc => `${loc}.json`);
  } else {
    console.log('🌍 Processing ALL locations\n');
    locationsToProcess = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.json'));
  }

  if (locationsToProcess.length === 0) {
    console.error('❌ No location files found!');
    process.exit(1);
  }

  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalNotFound = 0;

  // Process each location
  const results = locationsToProcess
    .map(file => processLocation(file))
    .filter(result => result.location !== null); // Filter out non-existent locations

  // Apply changes if not dry run
  if (!isDryRun) {
    console.log('\n💾 Saving changes...');
    results.forEach(({ location, changes, locationPath }) => {
      if (changes.length > 0 && locationPath) {
        fs.writeFileSync(
          locationPath,
          JSON.stringify(location, null, 2),
          'utf-8'
        );
        console.log(`  ✅ Updated: ${path.basename(locationPath)}`);
        totalUpdated += changes.length;
      }
    });
  }

  // Final summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('═'.repeat(60));

  // Separate character and location changes
  const characterChanges = [];
  const locationChanges = [];
  
  results.forEach(({ location, changes }) => {
    if (changes.length > 0) {
      changes.forEach(change => {
        if (change.type === 'character') {
          characterChanges.push({ location: location.name, ...change });
        } else if (change.type === 'sub-location') {
          locationChanges.push({ location: location.name, ...change });
        }
      });
    }
  });

  if (characterChanges.length > 0) {
    console.log('\n👥 Characters:');
    let currentLoc = null;
    characterChanges.forEach(change => {
      if (change.location !== currentLoc) {
        console.log(`\n  ${change.location}:`);
        currentLoc = change.location;
      }
      console.log(`    • ${change.name} → ${change.path}`);
    });
  }

  if (locationChanges.length > 0) {
    console.log('\n🏝️  Sub-locations:');
    let currentLoc = null;
    locationChanges.forEach(change => {
      if (change.location !== currentLoc) {
        console.log(`\n  ${change.location}:`);
        currentLoc = change.location;
      }
      console.log(`    • ${change.name} → ${change.path}`);
    });
  }

  const grandTotal = results.reduce((sum, r) => sum + r.changes.length, 0);
  
  console.log(`\n📈 Total images added:`);
  console.log(`   Characters: ${characterChanges.length}`);
  console.log(`   Sub-locations: ${locationChanges.length}`);
  console.log(`   Grand Total: ${grandTotal}`);

  if (isDryRun && grandTotal > 0) {
    console.log('\n💡 Run with --apply to save these changes');
  }
  
  if (targetSaga) {
    console.log(`\n🏴‍☠️ Saga processing complete: ${targetSaga.toUpperCase()}`);
  }
}

// Run the script
try {
  main();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

