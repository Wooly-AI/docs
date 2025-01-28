// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'WoolyAI Documentation',
  tagline: 'The Era of Unbound GPU Execution',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.woolyai.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wooly-ai', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
      },
      // Replace with your project's social card
      image: 'img/social-banner.png',
      navbar: {
        title: 'Documentation',
        logo: {
          alt: 'WoolyAI Logo',
          src: 'img/logo-full.svg',
        },
        items: [
          {
            href: 'https://woolyai.com',
            label: 'woolyai.com',
            position: 'right',
          },
        ],
      },
      footer: {
        // style: 'dark',
        links: [
          {
            title: 'WoolyAI',
            items: [
              {
                label: 'woolyai.com',
                href: 'https://woolyai.com',
              },
              {
                label: 'Privacy Policy',
                href: 'https://woolyai.com/privacy-policy',
              },
              {
                label: 'Terms of Service',
                href: 'https://woolyai.com/terms-of-service',
              },
              {
                label: 'About Us',
                href: 'https://woolyai.com/about-us',
              },
              {
                label: 'Products',
                href: 'https://woolyai.com/products',
              },
              {
                label: 'Blog',
                href: 'https://woolyai.com/blog',
              },
              {
                label: 'Get Started',
                href: 'https://woolyai.com/get-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'X',
                href: 'https://x.com/woolyai',
              },
              {
                label: 'Slack',
                href: 'https://slack.woolyai.com',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Wooly-AI',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} WoolyAI Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        // darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
