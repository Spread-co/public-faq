export default {
  editor: {
    label: { en: 'Public FAQ' },
    icon: 'question',
    categories: ['content'],
  },
  properties: {
    headline: {
      label: { en: 'Section Headline' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Frequently asked questions',
    },
    subheadline: {
      label: { en: 'Subheadline' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Everything you need to know about Spread.co.',
    },
    faqs: {
      label: { en: 'FAQ Items' },
      type: 'Array',
      bindable: true,
      defaultValue: [
        { id: '1', category: 'Getting Started', question: 'How does Spread.co work?', answer: 'Spread.co connects you with fresh local produce from nearby farms, delivered straight to your door on a weekly basis. Choose a membership plan, set up your delivery address, and browse our shop.' },
        { id: '2', category: 'Getting Started', question: 'What areas do you deliver to?', answer: 'We currently deliver to select regions across Australia. Enter your postcode on the sign-up page to check availability in your area.' },
        { id: '3', category: 'Orders', question: 'How do I place an order?', answer: 'Sign up for a membership, browse our shop, and add items to your cart. Orders are processed each week before the cutoff time shown in your dashboard.' },
        { id: '4', category: 'Orders', question: 'Can I modify an order after placing it?', answer: 'You can modify orders up to the cutoff time specified in your order confirmation email. After the cutoff, orders are locked for fulfilment.' },
        { id: '5', category: 'Membership', question: 'What is included in my membership?', answer: 'Membership gives you access to weekly deliveries, exclusive farm-gate pricing, priority capacity in your region, and a household sharing feature.' },
        { id: '6', category: 'Membership', question: 'How do I cancel my membership?', answer: 'You can cancel anytime from your account settings. No lock-in contracts. Your access continues until the end of the current billing period.' },
        { id: '7', category: 'Delivery', question: 'How is my produce packed?', answer: 'All produce is packed in reusable crates or compostable packaging to minimise waste. Crates are collected on your next delivery.' },
        { id: '8', category: 'Delivery', question: "What happens if I'm not home?", answer: "You can specify a safe drop location in your account. We'll leave your order there with a delivery notification." },
      ],
      options: {
        item: {
          type: 'Object',
          defaultValue: { id: '', category: '', question: '', answer: '' },
          options: {
            fields: [
              { key: 'id',       label: { en: 'ID' },       type: 'Text' },
              { key: 'category', label: { en: 'Category' },  type: 'Text' },
              { key: 'question', label: { en: 'Question' },  type: 'Text' },
              { key: 'answer',   label: { en: 'Answer' },    type: 'LongText' },
            ],
          },
        },
      },
    },
    showCategories: {
      label: { en: 'Show Category Filter' },
      type: 'OnOff',
      defaultValue: true,
    },
    allowMultiExpand: {
      label: { en: 'Allow Multiple Open' },
      type: 'OnOff',
      defaultValue: false,
    },
    defaultCategory: {
      label: { en: 'Default Active Category (blank = All)' },
      type: 'Text',
      bindable: true,
      defaultValue: '',
    },
    allLabel: {
      label: { en: 'All Categories Label' },
      type: 'Text',
      defaultValue: 'All',
    },
    contactText: {
      label: { en: 'Contact Prompt Text' },
      type: 'Text',
      defaultValue: "Still have questions? We're happy to help.",
    },
    contactLinkLabel: {
      label: { en: 'Contact Link Label' },
      type: 'Text',
      defaultValue: 'Get in touch',
    },
    contactLinkUrl: {
      label: { en: 'Contact Link URL' },
      type: 'Text',
      bindable: true,
      defaultValue: 'mailto:hello@spread.co',
    },
    portalTarget: {
      label: { en: 'Portal Target' },
      type: 'Text',
      bindable: true,
      hidden: true,
      defaultValue: '',
    },
  },
  triggerEvents: [
    {
      name: 'faq:item-opened',
      label: { en: 'On FAQ Item Opened' },
      event: { id: '', question: '', category: '' },
    },
    {
      name: 'faq:item-closed',
      label: { en: 'On FAQ Item Closed' },
      event: { id: '', question: '', category: '' },
    },
    {
      name: 'faq:category-changed',
      label: { en: 'On Category Filter Changed' },
      event: { category: '' },
    },
    {
      name: 'faq:contact-clicked',
      label: { en: 'On Contact Link Clicked' },
      event: {},
    },
  ],
};
