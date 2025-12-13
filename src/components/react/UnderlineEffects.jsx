import { useEffect } from 'react';

/**
 * @fileoverview UnderlineEffects.jsx
 * @description 为带有 .underline 类的元素添加悬停变色效果
 * @author Wenjie
 * @version 1.0.0
 */

/**
 * UnderlineEffects 组件
 * @description 无渲染组件，为页面中带有 .underline 类的元素添加悬停变色效果
 * @returns {null} 无渲染内容
 */
const UnderlineEffects = () => {
  useEffect(() => {
    /**
     * 可用的强调色数组
     * @description 定义可用于悬停效果的颜色集合
     * @type {string[]}
     */
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

    /**
     * 默认悬停颜色
     * @description 元素非悬停状态下的颜色
     * @type {string}
     */
    const DEFAULT_HOVER_COLOR = 'transparent';

    /**
     * 获取随机颜色
     * @description 从颜色数组中随机选择一个颜色
     * @returns {string} 随机选择的颜色
     */
    const getRandomColor = () => accentColors[Math.floor(Math.random() * accentColors.length)];

    /**
     * 元素监听器映射
     * @description 使用 WeakMap 存储元素的事件监听器，避免内存泄漏
     * @type {WeakMap<Element, {onMouseEnter: Function, onMouseLeave: Function}>}
     */
    const elementListeners = new WeakMap();

    /**
     * 绑定下划线效果
     * @description 为元素添加鼠标悬停事件监听器
     * @param {Element} element - 要绑定效果的 DOM 元素
     * @returns {void}
     */
    const bindUnderlineEffect = element => {
      if (!element || element.dataset.underlineBound === 'true') {
        return;
      }

      element.dataset.underlineBound = 'true';

      const onMouseEnter = () => {
        element.style.setProperty('--underline-hover-color', getRandomColor());
      };

      const onMouseLeave = () => {
        element.style.setProperty('--underline-hover-color', DEFAULT_HOVER_COLOR);
      };

      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);

      // 存储监听器以便清理
      elementListeners.set(element, { onMouseEnter, onMouseLeave });
    };

    /**
     * 解绑下划线效果
     * @description 移除元素的事件监听器并清理相关数据
     * @param {Element} element - 要解绑效果的 DOM 元素
     * @returns {void}
     */
    const unbindUnderlineEffect = element => {
      const listeners = elementListeners.get(element);
      if (!listeners) return;

      element.removeEventListener('mouseenter', listeners.onMouseEnter);
      element.removeEventListener('mouseleave', listeners.onMouseLeave);
      elementListeners.delete(element);
      delete element.dataset.underlineBound;
    };

    /**
     * 初始化设置
     * @description 为页面中已存在的 .underline 元素绑定效果
     */
    const initialElements = document.querySelectorAll('.underline');
    initialElements.forEach(bindUnderlineEffect);

    /**
     * 监听动态内容变化
     * @description 使用 MutationObserver 监听 DOM 变化，为新添加的元素绑定效果
     */
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // 处理新增节点
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          if (node.matches?.('.underline')) {
            bindUnderlineEffect(node);
          }
          node.querySelectorAll?.('.underline').forEach(bindUnderlineEffect);
        });

        // 处理删除节点，清理监听器
        mutation.removedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          if (node.matches?.('.underline')) {
            unbindUnderlineEffect(node);
          }
          node.querySelectorAll?.('.underline').forEach(unbindUnderlineEffect);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    /**
     * 清理函数
     * @description 组件卸载时清理所有事件监听器和观察器
     * @returns {Function} 清理函数
     */
    return () => {
      observer.disconnect();
      // 清理所有已绑定的监听器
      document
        .querySelectorAll('.underline[data-underline-bound="true"]')
        .forEach(unbindUnderlineEffect);
    };
  }, []);

  return null;
};

export default UnderlineEffects;
