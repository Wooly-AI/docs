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
      type: 'doc',
      label: 'GPU Auditor 📊',
      id: 'Root/GPU Auditor',
    },
    {
      type: 'link',
      label: 'WoolyAI GPU Operator',
      href: 'https://github.com/Wooly-AI/woolyai-gpu-operator',
    },
    {
      type: 'category',
      label: 'WoolyAI Server',
      collapsed: false,
      items: [
        'Root/Server/Set Up The Server',
        'Root/Server/Troubleshooting',
        'Root/Server/Release Notes',
        'Root/Server/Acknowledgments',
      ],
    },
    {
      type: 'category',
      label: 'WoolyAI Controller',
      collapsed: false,
      items: [
        'Root/Controller/Set Up The Controller',
        'Root/Controller/Troubleshooting',
        'Root/Controller/Release Notes',
        'Root/Controller/Acknowledgments',
      ],
    },
    {
      type: 'category',
      label: 'WoolyAI Client',
      collapsed: false,
      items: [
        'Root/Client/Set Up The Client',
        'Root/Client/Troubleshooting',
        'Root/Client/Release Notes',
        'Root/Client/Acknowledgments',
      ],
    },
  ]
};

export default sidebars;