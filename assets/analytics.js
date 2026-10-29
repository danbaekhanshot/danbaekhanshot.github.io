(function () {
  'use strict';

  const measurementId = document
    .querySelector('meta[name="ga4-measurement-id"]')
    ?.getAttribute('content')
    ?.trim();
  const hasMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId || '');

  window.dataLayer = window.dataLayer || [];

  if (hasMeasurementId) {
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  const commonParameters = {
    page_type: 'landing',
    page_version: 'v2'
  };

  const metaStandardEventNames = {
    generate_lead: 'Lead',
    sign_up: 'CompleteRegistration',
    contact_click: 'Contact',
    view_item: 'ViewContent',
    add_to_cart: 'AddToCart',
    begin_checkout: 'InitiateCheckout',
    search: 'Search'
  };

  function trackMetaEvent(eventName, parameters) {
    if (eventName === 'page_view' || /scroll/i.test(eventName)) return;

    if (eventName === 'purchase') {
      if (window.fbq) fbq('track', 'Purchase', {
        value: parameters.value,
        currency: parameters.currency || 'KRW'
      });
      return;
    }

    const metaEventName = metaStandardEventNames[eventName];
    if (metaEventName) {
      if (window.fbq) fbq('track', metaEventName);
      return;
    }

    if (window.fbq) fbq('trackCustom', eventName);
  }

  function track(eventName, parameters = {}) {
    const payload = { ...commonParameters, ...parameters };

    if (hasMeasurementId) {
      window.gtag('event', eventName, payload);
      trackMetaEvent(eventName, payload);
      return;
    }

    // Keeps events inspectable in preview/tests and compatible with a future GTM setup.
    window.dataLayer.push({ event: eventName, ...payload });
  }

  const packs = [
    { id: 'pack_1', name: '단백한샷 1박스', variant: '1_box', boxCount: 1, price: 28900 },
    { id: 'pack_2', name: '단백한샷 2박스', variant: '2_boxes', boxCount: 2, price: 54900 },
    { id: 'pack_3', name: '단백한샷 3박스', variant: '3_boxes', boxCount: 3, price: 79900 }
  ];

  function getPack(index) {
    return packs[index] || packs[0];
  }

  function itemFor(pack, quantity = 1) {
    return {
      item_id: pack.id,
      item_name: pack.name,
      item_brand: '단백한샷',
      item_category: 'protein_shot',
      item_variant: pack.variant,
      price: pack.price,
      quantity
    };
  }

  document.querySelectorAll('[data-analytics-content-id]').forEach((link) => {
    link.addEventListener('click', () => {
      track('select_content', {
        content_type: link.dataset.analyticsContentType || 'navigation',
        content_id: link.dataset.analyticsContentId,
        link_text: link.textContent.trim().replace(/\s+/g, ' '),
        link_url: link.getAttribute('href'),
        cta_position: link.dataset.analyticsPosition,
        target_section: link.dataset.analyticsTarget
      });
    });
  });

  const packSelector = document.querySelector('#pack');
  function trackPackSelectorOpen() {
    const pack = getPack(packSelector.selectedIndex);
    track('open_pack_selector', {
      current_pack_id: pack.id,
      current_pack_name: pack.name,
      section_id: 'offer'
    });
  }
  packSelector?.addEventListener('pointerdown', trackPackSelectorOpen);
  packSelector?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      trackPackSelectorOpen();
    }
  });

  document.querySelectorAll('#faq details[data-faq-id]').forEach((details) => {
    details.dataset.analyticsReady = 'false';
    details.addEventListener('toggle', () => {
      if (details.dataset.analyticsReady !== 'true') return;

      track('faq_toggle', {
        faq_id: details.dataset.faqId,
        faq_question: details.querySelector('summary')?.textContent.trim(),
        action: details.open ? 'expand' : 'collapse',
        section_id: 'faq'
      });
    });
  });
  setTimeout(() => {
    document.querySelectorAll('#faq details[data-faq-id]').forEach((details) => {
      details.dataset.analyticsReady = 'true';
    });
  }, 0);

  window.siteAnalytics = {
    track,
    getPack,
    itemFor,
    isConfigured: hasMeasurementId
  };
})();

