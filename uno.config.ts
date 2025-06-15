import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      // 从Iconify加载图标集
      collections: {
        carbon: () =>
          import('@iconify/json/json/carbon.json').then((i) => i.default),
        mdi: () => import('@iconify/json/json/mdi.json').then((i) => i.default),
        // 或者其他图标集
      },
    }),
  ],
});
