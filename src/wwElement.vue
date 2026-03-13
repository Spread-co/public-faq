<template>
  <section v-if="!content.portalTarget || content.portalTarget === 'public'" class="faq">
    <!-- Header -->
    <header class="faq__header">
      <h2 class="faq__headline" v-if="content.headline">{{ content.headline }}</h2>
      <p class="faq__subheadline" v-if="content.subheadline">{{ content.subheadline }}</p>
    </header>

    <!-- Category filter chips -->
    <nav v-if="content.showCategories && categories.length > 1" class="faq__categories" aria-label="Filter FAQ by category">
      <button
        v-for="cat in ['', ...categories]"
        :key="cat"
        class="faq__category-chip"
        :class="{ 'faq__category-chip--active': activeCategory === cat }"
        @click="setCategory(cat)"
        :aria-pressed="activeCategory === cat"
      >
        {{ cat === '' ? (content.allLabel || 'All') : cat }}
      </button>
    </nav>

    <!-- FAQ accordion -->
    <div class="faq__list" role="list">
      <div
        v-for="item in filteredFaqs"
        :key="item.id"
        class="faq__item"
        :class="{ 'faq__item--open': openIds.includes(item.id) }"
        role="listitem"
      >
        <button
          class="faq__question"
          :aria-expanded="openIds.includes(item.id)"
          :aria-controls="`faq-answer-${item.id}`"
          @click="toggleItem(item)"
        >
          <span class="faq__question-text">{{ item.question }}</span>
          <span class="faq__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <div
          class="faq__answer-wrap"
          :id="`faq-answer-${item.id}`"
          role="region"
          :aria-labelledby="`faq-question-${item.id}`"
        >
          <div class="faq__answer">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredFaqs.length === 0" class="faq__empty">
        <p>No questions found in this category.</p>
      </div>
    </div>

    <!-- Contact footer -->
    <div class="faq__contact" v-if="content.contactText">
      <p class="faq__contact-text">{{ content.contactText }}</p>
      <a
        v-if="content.contactLinkLabel && content.contactLinkUrl"
        class="faq__contact-link"
        :href="content.contactLinkUrl"
        @click="handleContactClick"
      >{{ content.contactLinkLabel }}</a>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    /* wwEditor:start */
    wwEditorState:  { type: Object, required: true },
    /* wwEditor:end */
    content:        { type: Object, required: true },
    wwFrontState:   { type: Object, required: true },
    wwElementState: { type: Object, required: true },
  },

  emits: ['trigger-event'],

  data() {
    return {
      openIds:        [],
      activeCategory: '',
    };
  },

  mounted() {
    if (this.content.defaultCategory) {
      this.activeCategory = this.content.defaultCategory;
    }
  },

  computed: {
    faqs() {
      return Array.isArray(this.content.faqs) ? this.content.faqs : [];
    },

    categories() {
      const cats = [];
      for (const item of this.faqs) {
        if (item.category && !cats.includes(item.category)) {
          cats.push(item.category);
        }
      }
      return cats;
    },

    filteredFaqs() {
      if (!this.activeCategory) return this.faqs;
      return this.faqs.filter(f => f.category === this.activeCategory);
    },
  },

  methods: {
    setCategory(cat) {
      this.activeCategory = cat;
      // Close items no longer visible when filtering
      const visibleIds = this.filteredFaqs.map(f => f.id);
      this.openIds = this.openIds.filter(id => visibleIds.includes(id));
      this.$emit('trigger-event', { name: 'faq:category-changed', event: { category: cat } });
    },

    toggleItem(item) {
      const isOpen = this.openIds.includes(item.id);
      if (isOpen) {
        this.openIds = this.openIds.filter(id => id !== item.id);
        this.$emit('trigger-event', {
          name: 'faq:item-closed',
          event: { id: item.id, question: item.question, category: item.category },
        });
      } else {
        if (!this.content.allowMultiExpand) {
          this.openIds = [item.id];
        } else {
          this.openIds = [...this.openIds, item.id];
        }
        this.$emit('trigger-event', {
          name: 'faq:item-opened',
          event: { id: item.id, question: item.question, category: item.category },
        });
      }
    },

    handleContactClick() {
      this.$emit('trigger-event', { name: 'faq:contact-clicked', event: {} });
    },
  },
};
</script>

<style scoped>
/* ── Design tokens ───────────────────────────────────────────────────────── */
.faq {
  --faq-primary:        #4B162D;
  --faq-accent:         #CE6632;
  --faq-accent-hover:   #B85A2B;
  --faq-gold:           #BEAD38;
  --faq-beige:          #E6D8CA;
  --faq-text:           #1A1A1A;
  --faq-text-secondary: #4B5563;
  --faq-surface:        #FFFFFF;
  --faq-bg:             #FBFAF8;
  --faq-border:         #EDE4D8;
  --faq-radius-sm:      8px;
  --faq-radius-md:      12px;
  --faq-radius-lg:      16px;
  --faq-font:           'Work Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --faq-max-width:      720px;

  box-sizing: border-box;
  font-family: var(--faq-font);
  background: var(--faq-bg);
  padding: 48px 20px 64px;
  color: var(--faq-text);
}

.faq *, .faq *::before, .faq *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Header ─────────────────────────────────────────────────────────────── */
.faq__header {
  max-width: var(--faq-max-width);
  margin: 0 auto 32px;
  text-align: center;
}

.faq__headline {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--faq-primary);
  line-height: 1.15;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.faq__subheadline {
  font-size: 1.0625rem;
  color: var(--faq-text-secondary);
  line-height: 1.6;
}

/* ── Category chips ─────────────────────────────────────────────────────── */
.faq__categories {
  max-width: var(--faq-max-width);
  margin: 0 auto 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.faq__category-chip {
  font-family: var(--faq-font);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 9999px;
  border: 1.5px solid var(--faq-border);
  background: var(--faq-surface);
  color: var(--faq-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.faq__category-chip:hover {
  border-color: var(--faq-accent);
  color: var(--faq-accent);
}

.faq__category-chip--active {
  background: var(--faq-primary);
  border-color: var(--faq-primary);
  color: #FFFFFF;
}

.faq__category-chip--active:hover {
  background: #3a0f22;
  border-color: #3a0f22;
  color: #FFFFFF;
}

/* ── FAQ list ────────────────────────────────────────────────────────────── */
.faq__list {
  max-width: var(--faq-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── FAQ item ────────────────────────────────────────────────────────────── */
.faq__item {
  border-bottom: 1px solid var(--faq-border);
  background: var(--faq-surface);
  transition: background 0.15s;
}

.faq__item:first-child {
  border-top: 1px solid var(--faq-border);
  border-radius: var(--faq-radius-md) var(--faq-radius-md) 0 0;
  overflow: hidden;
}

.faq__item:last-child {
  border-radius: 0 0 var(--faq-radius-md) var(--faq-radius-md);
  overflow: hidden;
}

/* ── Question button ─────────────────────────────────────────────────────── */
.faq__question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--faq-font);
  transition: background 0.12s;
}

.faq__question:hover {
  background: rgba(206, 102, 50, 0.04);
}

.faq__item--open .faq__question {
  background: rgba(75, 22, 45, 0.03);
}

.faq__question-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--faq-primary);
  line-height: 1.5;
  flex: 1;
}

/* ── Chevron ─────────────────────────────────────────────────────────────── */
.faq__chevron {
  flex-shrink: 0;
  color: var(--faq-accent);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
}

.faq__item--open .faq__chevron {
  transform: rotate(180deg);
}

/* ── Answer (CSS-only expand using max-height trick) ─────────────────────── */
.faq__answer-wrap {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq__item--open .faq__answer-wrap {
  max-height: 600px;
}

.faq__answer {
  padding: 0 20px 20px;
  font-size: 0.9375rem;
  color: var(--faq-text-secondary);
  line-height: 1.7;
  border-left: 3px solid var(--faq-accent);
  margin-left: 20px;
  padding-left: 16px;
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
.faq__empty {
  padding: 48px 20px;
  text-align: center;
  color: var(--faq-text-secondary);
  font-size: 0.9375rem;
  border: 1px dashed var(--faq-border);
  border-radius: var(--faq-radius-md);
}

/* ── Contact footer ──────────────────────────────────────────────────────── */
.faq__contact {
  max-width: var(--faq-max-width);
  margin: 40px auto 0;
  text-align: center;
  padding: 28px 24px;
  background: var(--faq-primary);
  border-radius: var(--faq-radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.faq__contact-text {
  font-size: 1rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.5;
}

.faq__contact-link {
  display: inline-flex;
  align-items: center;
  font-family: var(--faq-font);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #FFFFFF;
  text-decoration: none;
  padding: 10px 24px;
  background: var(--faq-accent);
  border-radius: 9999px;
  transition: background 0.15s;
  letter-spacing: 0.01em;
}

.faq__contact-link:hover {
  background: var(--faq-accent-hover);
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (min-width: 768px) {
  .faq {
    padding: 72px 48px 80px;
  }

  .faq__question {
    padding: 20px 24px;
  }

  .faq__answer {
    padding: 0 24px 24px;
    margin-left: 24px;
  }

  .faq__contact {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .faq {
    padding: 96px 64px 96px;
  }
}

/* ── Print styles ────────────────────────────────────────────────────────── */
@media print {
  .faq__categories { display: none; }
  .faq__item--open .faq__answer-wrap,
  .faq__answer-wrap { max-height: none !important; }
  .faq__contact { background: transparent; color: var(--faq-text); border: 1px solid #ccc; }
}
</style>
