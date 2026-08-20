const fs = require('fs');

['mobile/src/screens/HomeScreen.tsx', 'src/screens/HomeScreen.tsx'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  if (!code.includes('featuredImg')) {
    code = code.replace(
      `<TouchableOpacity key={item.id} style={styles.itemCard} onPress={onNavigateToOrder}>
            <View style={styles.itemCardContent}>`,
      `<TouchableOpacity key={item.id} style={styles.itemCard} onPress={onNavigateToOrder}>
            <View style={styles.featuredImgContainer}>
              <Image source={{ uri: item.image_url || '/assets/food/wrap_kebab_poulet.png' }} style={styles.featuredImg} resizeMode="cover" />
            </View>
            <View style={styles.itemCardContent}>`
    );

    code = code.replace(
      `itemCard: {`,
      `featuredImgContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E28',
    marginRight: 12,
  },
  featuredImg: {
    width: '100%',
    height: '100%',
  },
  itemCard: {`
    );
  }

  fs.writeFileSync(filePath, code);
  console.log('Updated featured cards in ' + filePath);
});

