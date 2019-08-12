const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

function getStyleDictionaryConfig(brand, platform) {
  return {
    "source": [
      `properties/brands/${brand}/*.json`,
      "properties/globals/**/*.json",
      `properties/platforms/${platform}/*.json`
    ],
    "platforms": {
      "web": {
        "transformGroup": "scss",
        "buildPath": `build/web/${brand}/`,
        "files": [{
          "destination": `${brand}-tokens.scss`,
          "format": "scss/variables"
        }]
      },
      "json": {
        "transformGroup": "scss",
        "buildPath": `build/web/${brand}/`,
        "files": [
        {
          "destination": `${brand}-tokens-color.json`,
          "format": "json/flat",
          "filter": {
            "attributes": {
              "category": "color"
            }
          }
        }]
      },
      "css": {
        "transformGroup": "web",
        "buildPath": `build/css/${brand}/`,
        "files": [{
          "destination": `${brand}-tokens.css`,
          "format": "css/variables"
        }]
      },
      "android": {
        "transformGroup": "android",
        "buildPath": `build/android/${brand}/`,
        "files": [{
          "destination": "tokens.colors.xml",
          "format": "android/colors"
        },{
          "destination": "tokens.dimens.xml",
          "format": "android/dimens"
        },{
          "destination": "tokens.font_dimens.xml",
          "format": "android/fontDimens"
        }]
      },
      "ios": {
        "transformGroup": "ios",
        "buildPath": `build/ios/${brand}/`,
        "files": [{
          "destination": "tokens.h",
          "format": "ios/macros"
        }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFERENT BRANDS AND PLATFORMS

['default', 'companies', 'mbie', 'mattr'].map(function (brand) {
//   ['web', 'ios', 'android'].map(function (platform) {
  ['web', 'json'].map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${brand}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(brand, platform));

    StyleDictionary.buildPlatform(platform);

    console.log('\nEnd processing');

  })
})

console.log('\n==============================================');
console.log('\nBuild completed!');