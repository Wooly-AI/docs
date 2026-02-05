// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'WoolyAI Documentation',
  tagline: 'Hypervise, Maximize, and Optimize your ML GPUs',
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

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Only noIndex when on staging branch
  noIndex: process.env.GITHUB_REF_NAME === 'staging' || process.env.BRANCH === 'staging',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          lastVersion: 'current',
          versions: {
            current: {
              label: '0.1.x',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        }
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
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            
          },
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
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/woolyai',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/woolyaiinc',
              },
              {
                label: 'TikTok',
                href: 'https://www.tiktok.com/@woolyai',
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
      algolia: process.env.NODE_ENV === 'production'
        ? {
            appId: 'U0AILZ2DL1',
            apiKey: '8030c74c14625c9c1b0bb849d72aedff',
            indexName: 'WoolyAI Documentation',
            contextualSearch: true,
            searchPagePath: 'search',
          }
        : false,
      // Declare some <meta> tags
      metadata: [
        { name: 'keywords', content: 'WoolyAI, GPU, Hypervisor, ML, AI, CUDA, ROCm, AMD, NVIDIA, Server, Client, Controller, GPU Utilization, GPU Management, GPU Scheduling, GPU Allocation, GPU Scheduling Algorithms, GPU Scheduling Policies, GPU Scheduling Strategies, GPU Scheduling Techniques, GPU Scheduling Algorithms, GPU Scheduling Policies, GPU Scheduling Strategies, GPU Scheduling Techniques' },
      ],
    }),
};

export default config;
