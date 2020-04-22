const StyleDictionaryPackage = require('style-dictionary').extend(__dirname + '/config.json');
//const StyleDictionary = require('style-dictionary').extend(__dirname + '/config.json');
const fs = require('fs');
const _ = require('lodash');

  // These formatting functions are using the Lodash "template" syntax

StyleDictionaryPackage.registerFormat({
  name: 'custom/html',
  formatter: _.template(fs.readFileSync(__dirname + '/templates/web-html.template'))
});

StyleDictionaryPackage.registerTransform({
  name: 'size/unitless',
  type: 'value',
  matcher: function(prop) {
    return ["size", "time", "shadow"].some(val => val === prop.attributes.category);
  },
  transformer: function(prop) {
      return Number.parseFloat(prop.original.value);
  }
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'accessibility',
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/hex'
  ]
});

// StyleDictionaryPackage.registerTransform({
//   name: 'react/radius',
//   type: 'value',
//   matcher: function(prop) {
//     return ["radius"].some(val => val === prop.attributes.category);
//   },
//   transformer: function(prop) {
//       return Number.parseFloat(prop.value * 16);
//   }
// });

StyleDictionaryPackage.registerTransform({ 
    name: 'size/fontScale',
    type: 'value',
    matcher: function(prop) {
      return (prop.attributes.category === 'size' || prop.attributes.category === 'font') && 
      (prop.attributes.type === 'font' || prop.attributes.type === 'icon' || prop.attributes.type === 'lineheight')
    },
    transformer: function(prop) {
      return (prop.original.value * 16);
    }
});

StyleDictionaryPackage.registerFilter({
  name: 'filter-alias',
  matcher: function(prop) {
    return prop.attributes.category !== 'brand';
  }
});


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
        "transformGroup": "accessibility",
        "buildPath": `build/${brand}/web/`,
        "files": [{
          "destination": `${brand}-tokens.scss`,
          "format": "scss/variables",
          "filter": "filter-alias"
        },
        {
          "destination": `${brand}-tokens.css`,
          "format": "css/variables",
          "filter": "filter-alias"
        }
      ]
      },
      "accessibility": {
        "transformGroup": "accessibility",
        "buildPath": `build/${brand}/accesibility/`,
        "files": [
        {
          "destination": `${brand}-color-tokens.json`,
          "format": "json/nested",
          "filter": {
            "attributes": {
              "category": "color"
            }
          }
        }
      ]
      },
      "styleguide": {
        "transformGroup": "scss",
        "buildPath": `build/${brand}/styleguide/`,
        "files": [
        {
          "destination": `${brand}-tokens.html`,
          "format": "custom/html"
        }
      ]
      },
      "reactNative": {
        "transforms": ["attribute/cti","name/cti/camel","size/unitless","size/fontScale"],
        "buildPath": `build/${brand}/react-native/`,
        "files": [
          {
          "destination": `${brand}-tokens.json`,
          "format": "json/nested"
          }
        ],
      }
    }
  
  }
}


// PROCESS THE DESIGN TOKENS FOR THE DIFFERENT BRANDS AND PLATFORMS

['mattr'].map(function (brand) {
  ['reactNative', 'web', 'styleguide', 'accessibility'].map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${brand}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(brand, platform));

    StyleDictionary.buildPlatform(platform);

    console.log('\nEnd processing');

  })
})

console.log('\n==============================================');
console.log('\nBuild completed!');