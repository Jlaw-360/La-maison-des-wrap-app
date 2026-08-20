const fs = require('fs');

['mobile/src/screens/OrderScreen.tsx', 'src/screens/OrderScreen.tsx'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure Image is imported
  if (!code.includes('Image,')) {
    code = code.replace("import { View, Text, StyleSheet,", "import { View, Text, StyleSheet, Image,");
  }

  // Update cardHeader to display the image thumbnail
  if (!code.includes('itemThumbnail')) {
    code = code.replace(
      `<View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>`,
      `<View style={styles.cardHeader}>
              <View style={{ flex: 1, paddingRight: 10 }}>`
    );

    code = code.replace(
      `<Text style={styles.itemDescription} numberOfLines={2}>
                  {language === 'fr' ? item.description_fr : item.description_en}
                </Text>
              </View>
            </View>`,
      `<Text style={styles.itemDescription} numberOfLines={2}>
                  {language === 'fr' ? item.description_fr : item.description_en}
                </Text>
              </View>
              <View style={styles.itemThumbnailContainer}>
                <Image 
                  source={{ uri: item.image_url || '/assets/food/wrap_kebab_poulet.png' }} 
                  style={styles.itemThumbnail} 
                  resizeMode="cover"
                />
              </View>
            </View>`
    );

    // Add styles
    code = code.replace(
      `menuCard: {`,
      `itemThumbnailContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E28',
  },
  itemThumbnail: {
    width: '100%',
    height: '100%',
  },
  menuCard: {`
    );
  }

  fs.writeFileSync(filePath, code);
  console.log('Updated food thumbnails in ' + filePath);
});

