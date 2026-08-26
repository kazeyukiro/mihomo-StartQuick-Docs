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
        'level-0/how-it-works',
        'level-0/proxy-node-protocol',
        'level-0/rules-and-groups',
        'level-0/dns',
        'level-0/inbound',
        'level-0/next',
        'level-0/appendix',
      ],
    },
    {
      type: 'category',
      label: '🚀 快速开始',
      items: [
        'getting-started/index',
        'getting-started/install',
        'getting-started/first-config',
        'getting-started/first-proxy',
        'getting-started/basic-routing',
        'getting-started/gui-clients',
        'getting-started/subscription',
      ],
    },
    {
      type: 'category',
      label: '⚙️ 配置参考',
      items: [
        'config/index',
        'config/general',
        'config/inbound',
        'config/proxies',
        'config/proxy-groups',
        'config/rules',
        'config/dns',
        'config/providers',
      ],
    },
    'faq',
  ],
};

export default sidebars;
