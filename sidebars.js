// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
 const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    // { 
    //   type: 'category', 
    //   label: 'Use Cases 📚', 
    //   collapsible: false, 
    //   items: [
    //     'Use Cases/LLM Inference',
    //     'Use Cases/LLM Training'
    //   ] 
    // },
    {
      type: 'doc',
      label: 'Introduction 📖',
      id: 'Root/Introduction',
    },
    {
      type: 'category',
      label: 'Quick Start 🚀',
      collapsible: false,
      items: [
        'Quick Start/Running The Wooly Server',
        'Quick Start/Running The Wooly Client',
        'Quick Start/Running The Wooly Controller',
      ],
    },
    {
      type: 'doc',
      label: 'Glossary 📚',
      id: 'Root/Glossary',
    },
    {
      type: 'doc',
      label: 'GPU Auditor 📊',
      id: 'Root/GPU Auditor',
    },
    {
      type: 'category',
      label: 'WoolyAI Server',
      collapsed: false,
      items: [
        'Root/Server/Using the VRAM Model Cache Tool',
        'Root/Server/Troubleshooting',
        'Root/Server/Acknowledgments',
        'Root/Server/Release Notes',
      ],
    },
    {
      type: 'category',
      label: 'WoolyAI Client',
      collapsed: false,
      items: [
        'Root/Client/Troubleshooting',
        'Root/Client/Acknowledgments',
        'Root/Client/Release Notes',
      ],
    },
    {
      type: 'category',
      label: 'WoolyAI Controller',
      collapsed: false,
      items: [
        'Root/Controller/Troubleshooting',
        'Root/Controller/Acknowledgments',
        'Root/Controller/Release Notes',
      ],
    },
  ]
};

export default sidebars;