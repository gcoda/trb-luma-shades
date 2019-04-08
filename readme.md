# iterative color shade generator

## tailwind.config.js
```javascript
const { shadesPreset, shadesConfig, shades } = require('@therobot/luma-shades')

module.exports = {
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    colors: {
      accent: shades('#ff9900', {
        ...shadesConfig,
        420: { min: 0.38, max: 0.41 },
        1337: { min: 0.23, max: 0.29 },
        base: { min: 0.7, max: 0.75 },
      }),
      brand: { ...shadesPreset('#ff9900'), base: '#ff9900' },
      rad: shadesPreset('#e53e3e'),
      
      // grey: {
      // ... 
    }
  }
}
```