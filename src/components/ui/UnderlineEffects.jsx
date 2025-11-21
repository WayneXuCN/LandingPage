'use client';

import { useEffect } from 'react';

const UnderlineEffects = () => {
  useEffect(() => {
    const accentColors = [
      '#10b981', // 绿色
      '#3b82f6', // 蓝色
      '#f97316', // 橙色
      '#8b5cf6', // 紫色
      '#ec4899', // 粉色
      '#06b6d4', // 青色
      '#eab308', // 黄色
      '#ef4444', // 红色
    ];

    const DEFAULT_HOVER_COLOR = 'transparent';

    const getRandomColor = () =>
      accentColors[Math.floor(Math.random() * accentColors.length)];

    const setUnderlineHoverColor = (element, color) => {
      element.style.setProperty('--underline-hover-color', color);
    };

    const bindUnderlineEffect = (element) => {
      if (!element || element.dataset.underlineBound === 'true') {
        return;
      }

      // Mark as bound to avoid double binding
      element.dataset.underlineBound = 'true';

      const onMouseEnter = () => {
        setUnderlineHoverColor(element, getRandomColor());
      };

      const onMouseLeave = () => {
        setUnderlineHoverColor(element, DEFAULT_HOVER_COLOR);
      };

      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);
      
      // Store listeners for potential cleanup (though difficult to fully clean up without weakmaps)
      element._underlineListeners = { onMouseEnter, onMouseLeave };
    };

    const setupRandomUnderlineColors = () => {
      document.querySelectorAll('.underline').forEach(bindUnderlineEffect);
    };

    // Initial setup
    setupRandomUnderlineColors();

    // Observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          if (node.matches?.('.underline')) {
            bindUnderlineEffect(node);
          }

          if (node.querySelectorAll) {
            node.querySelectorAll('.underline').forEach(bindUnderlineEffect);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      // We don't aggressively remove listeners here as it might be complex and unnecessary for this simple effect
    };
  }, []);

  return null;
};

export default UnderlineEffects;
