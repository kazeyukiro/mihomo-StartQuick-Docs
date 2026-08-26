/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🌱 小小白白话文',
      collapsible: false,
      items: [
        'level-0/index',
        'level-0/what-is-mihomo',
        'level-0/proxy-node-protocol',
        'level-0/rules-and-groups',
        'level-0/dns',
        'level-0/inbound',
        'level-0/next',
      ],
    },
    {
      type: 'category',
      label: '🚀 快速开始',
      items: [
        'getting-started/index',
        'getting-started/first-config',
        'getting-started/first-proxy',
      ],
    },
    {
      type: 'category',
      label: '⚙️ 配置参考',
      items: [
        'config/index',
        'config/proxies',
        'config/proxy-groups',
        'config/rules',
        'config/dns',
      ],
    },
    'faq',
  ],
};

export default sidebars;
