import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  addons: [
    '@storybook/addon-essentials',   // controls, actions, docs, viewport, backgrounds
    '@storybook/addon-interactions', // play functions
    '@storybook/addon-a11y',         // accessibility audit panel
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    // Use project tsconfig for type-checking in Storybook
    reactDocgen: 'react-docgen-typescript',
    check: false,
  },

  docs: {
    autodocs: 'tag',
  },
}

export default config
