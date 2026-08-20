const fs = require('fs');

['mobile/src/screens/CustomizerModal.tsx', 'src/screens/CustomizerModal.tsx'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure Image is imported
  if (!code.includes('Image,')) {
    code = code.replace("import { View, Text, StyleSheet, Modal,", "import { View, Text, StyleSheet, Modal, Image,");
  }

  // Insert image banner
  if (!code.includes('dishImageBanner')) {
    code = code.replace(
      `<ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>`,
      `<ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Dish Photo Banner */}
            <View style={styles.dishImageBannerContainer}>
              <Image 
                source={{ uri: item.image_url || '/assets/food/wrap_kebab_poulet.png' }} 
                style={styles.dishImageBanner}
                resizeMode="cover"
              />
            </View>`
    );

    code = code.replace(
      `scrollArea: {`,
      `dishImageBannerContainer: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1E1E28',
  },
  dishImageBanner: {
    width: '100%',
    height: '100%',
  },
  scrollArea: {`
    );
  }

  fs.writeFileSync(filePath, code);
  console.log('Updated CustomizerModal with dish image banner in ' + filePath);
});

