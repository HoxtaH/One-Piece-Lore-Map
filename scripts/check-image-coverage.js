#!/usr/bin/env node

/**
 * Image Coverage Checker
 * 
 * Shows which characters have images and which need images
 * Helps prioritize which images to add next
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data', 'locations');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'characters');

// Helper to check if image file actually exists
function imageExists(avatarPath) {
  if (!avatarPath) return false;
  const imagePath = path.join(process.cwd(), 'public', avatarPath);
  return fs.existsSync(imagePath);
}

// Define location order for organized reporting
const LOCATION_ORDER = [
  // East Blue Saga
  'dawn-island', 'shell-town', 'orange-town', 'syrup-village', 'baratie', 'arlong-park', 'loguetown',
  // Alabasta Saga
  'reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island', 'alabasta',
  // Grand Line - Paradise
  'skypeia', 'sabaody-archipelago', 'dressrosa',
  // Grand Line - New World
  'wano', 'egghead'
];

function checkCoverage() {
  console.log('📊 Image Coverage Report\n');
  console.log('═'.repeat(70));

  const locationFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  
  // Sort files by our predefined order
  const sortedFiles = locationFiles.sort((a, b) => {
    const slugA = a.replace('.json', '');
    const slugB = b.replace('.json', '');
    const indexA = LOCATION_ORDER.indexOf(slugA);
    const indexB = LOCATION_ORDER.indexOf(slugB);
    
    // If not in order array, put at end
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
  
  let totalCharacters = 0;
  let totalWithImages = 0;
  let totalWithoutImages = 0;

  // Group by saga for better organization
  const sagaHeaders = {
    'dawn-island': '\n🌊 EAST BLUE SAGA',
    'reverse-mountain': '\n🏔️  ALABASTA SAGA',
    'skypeia': '\n☁️  GRAND LINE - PARADISE',
    'wano': '\n🌏 GRAND LINE - NEW WORLD'
  };

  sortedFiles.forEach(file => {
    const location = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
    const characters = location.notablePeople || [];
    
    // Print saga header if this is the first location in a saga
    const sagaHeader = sagaHeaders[location.slug];
    if (sagaHeader) {
      console.log(sagaHeader);
      console.log('═'.repeat(70));
    }
    
    if (characters.length === 0) return;

    console.log(`\n📍 ${location.name}`);
    console.log('─'.repeat(70));

    const withImages = characters.filter(c => c.avatar && imageExists(c.avatar));
    const withoutImages = characters.filter(c => !c.avatar || !imageExists(c.avatar));

    const coverage = characters.length > 0 
      ? Math.round((withImages.length / characters.length) * 100) 
      : 0;

    // Color-coded progress indicator
    let progressIcon = '🔴';
    if (coverage === 100) progressIcon = '🟢';
    else if (coverage >= 50) progressIcon = '🟡';

    console.log(`${progressIcon} Progress: ${withImages.length}/${characters.length} (${coverage}%)`);

    if (withImages.length > 0) {
      console.log('\n✅ Characters WITH images:');
      withImages.forEach(c => {
        console.log(`   • ${c.name} → ${c.avatar}`);
      });
    }

    if (withoutImages.length > 0) {
      console.log('\n❌ Characters MISSING images:');
      withoutImages.forEach(c => {
        const normalizedName = c.name
          .toLowerCase()
          .replace(/['']/g, '')
          .replace(/\./g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        console.log(`   • ${c.name}`);
        console.log(`     Expected: public/images/characters/${location.slug}/${normalizedName}.jpg`);
      });
    }

    totalCharacters += characters.length;
    totalWithImages += withImages.length;
    totalWithoutImages += withoutImages.length;
  });

  // Final Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📈 OVERALL SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total Characters: ${totalCharacters}`);
  console.log(`✅ With Images: ${totalWithImages} (${Math.round((totalWithImages/totalCharacters)*100)}%)`);
  console.log(`❌ Without Images: ${totalWithoutImages} (${Math.round((totalWithoutImages/totalCharacters)*100)}%)`);

  // Calculate saga-specific coverage
  console.log('\n📊 COVERAGE BY SAGA:');
  console.log('─'.repeat(70));
  
  const sagaGroups = {
    'East Blue': ['dawn-island', 'shell-town', 'orange-town', 'syrup-village', 'baratie', 'arlong-park', 'loguetown'],
    'Alabasta': ['reverse-mountain', 'whiskey-peak', 'little-garden', 'drum-island', 'alabasta'],
    'Paradise': ['skypeia', 'sabaody-archipelago', 'dressrosa'],
    'New World': ['wano', 'egghead']
  };

  Object.entries(sagaGroups).forEach(([sagaName, slugs]) => {
    let sagaTotal = 0;
    let sagaWithImages = 0;

    slugs.forEach(slug => {
      const filePath = path.join(DATA_DIR, `${slug}.json`);
      if (fs.existsSync(filePath)) {
        const location = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const chars = location.notablePeople || [];
        sagaTotal += chars.length;
        sagaWithImages += chars.filter(c => c.avatar && imageExists(c.avatar)).length;
      }
    });

    if (sagaTotal > 0) {
      const coverage = Math.round((sagaWithImages / sagaTotal) * 100);
      let icon = '🔴';
      if (coverage === 100) icon = '🟢';
      else if (coverage >= 50) icon = '🟡';
      
      console.log(`${icon} ${sagaName}: ${sagaWithImages}/${sagaTotal} (${coverage}%)`);
    }
  });

  if (totalWithoutImages > 0) {
    console.log('\n💡 To add images:');
    console.log('   1. Download character images from One Piece Wiki');
    console.log('   2. Rename to match expected filenames (see above)');
    console.log('   3. Place in appropriate directory');
    console.log('   4. Run: node scripts/add-images.js --apply');
    console.log('   Or use: node scripts/image-manager.js batch <location>');
  } else {
    console.log('\n🎉 All characters have images!');
  }

  // Check for orphaned images
  console.log('\n' + '═'.repeat(70));
  console.log('🔍 ORPHANED IMAGES (images without matching characters)');
  console.log('═'.repeat(70));

  let orphanedCount = 0;
  sortedFiles.forEach(file => {
    const location = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
    const locationImagesDir = path.join(IMAGES_DIR, location.slug);
    
    if (!fs.existsSync(locationImagesDir)) return;

    const imageFiles = fs.readdirSync(locationImagesDir)
      .filter(f => ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(path.extname(f).toLowerCase()));

    const characterNames = (location.notablePeople || []).map(c => 
      c.name.toLowerCase().replace(/['']/g, '').replace(/\./g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    );

    imageFiles.forEach(imageFile => {
      const imageName = path.basename(imageFile, path.extname(imageFile))
        .toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      if (!characterNames.includes(imageName)) {
        console.log(`⚠️  ${location.name}: ${imageFile} (no matching character)`);
        orphanedCount++;
      }
    });
  });

  if (orphanedCount === 0) {
    console.log('✅ No orphaned images found!');
  } else {
    console.log(`\n⚠️  Found ${orphanedCount} orphaned image(s)`);
    console.log('   These images exist but don\'t match any character names');
  }
}

try {
  checkCoverage();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

