import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import emailjs from '@emailjs/browser';

/**
 * @fileoverview Contact.jsx
 * @description 联系页面交互组件，包含邮箱卡片、社交链接和联系表单
 * @author Wenjie
 * @version 1.0.0
 *
 * 环境变量（Astro 使用 PUBLIC_ 前缀）：
 * - PUBLIC_EMAILJS_SERVICE_ID: EmailJS 服务 ID
 * - PUBLIC_EMAILJS_TEMPLATE_ID: EmailJS 模板 ID
 * - PUBLIC_EMAILJS_PUBLIC_KEY: EmailJS 公钥
 */

/**
 * Icon 组件
 * @description 渲染不同类型的 SVG 图标
 * @param {Object} props - 组件属性
 * @param {string} props.name - 图标名称，支持 'envelope', 'check', 'alert', 'copy', 'external', 'github', 'globe', 'scholar' 等
 * @param {string} [props.className=''] - 自定义 CSS 类名
 * @returns {JSX.Element} SVG 图标元素
 */
const Icon = ({ name, className = '' }) => {
  const common = {
    className,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  };

  switch (name) {
    case 'envelope':
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M4 4h16v16H4z' />
          <path d='M22 6l-10 7L2 6' />
        </svg>
      );
    case 'check':
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M20 6L9 17l-5-5' />
        </svg>
      );
    case 'alert':
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M10.3 3.7L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.7a2 2 0 00-3.4 0z' />
          <path d='M12 9v4' />
          <path d='M12 17h.01' />
        </svg>
      );
    case 'copy':
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M8 8h12v12H8z' />
          <path d='M4 16H3a1 1 0 01-1-1V3a1 1 0 011-1h12a1 1 0 011 1v1' />
        </svg>
      );
    case 'external':
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M14 3h7v7' />
          <path d='M10 14L21 3' />
          <path d='M21 14v7H3V3h7' />
        </svg>
      );
    case 'github':
      return (
        <svg {...common} fill='currentColor'>
          <path d='M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.01 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12 12 0 0012 .5z' />
        </svg>
      );
    case 'globe':
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10' />
          <path d='M2 12h20' />
          <path d='M12 2a15 15 0 010 20' />
          <path d='M12 2a15 15 0 000 20' />
        </svg>
      );
    case 'scholar':
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M22 10L12 5 2 10l10 5 10-5z' />
          <path d='M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5' />
        </svg>
      );
    default:
      return (
        <svg
          {...common}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 000-7.07 5 5 0 00-7.07 0L10 5.86' />
          <path d='M14 11a5 5 0 00-7.07 0L5.52 12.4a5 5 0 000 7.07 5 5 0 007.07 0L14 18.14' />
        </svg>
      );
  }
};

/**
 * 从 FontAwesome 类名获取图标类型
 * @description 将 FontAwesome 类名转换为内部图标类型
 * @param {string} faClass - FontAwesome 类名
 * @returns {string} 对应的内部图标类型
 */
const getIconKindFromFa = faClass => {
  const v = String(faClass || '').toLowerCase();
  if (v.includes('github')) return 'github';
  if (v.includes('google')) return 'scholar';
  if (v.includes('globe') || v.includes('web')) return 'globe';
  if (v.includes('envelope') || v.includes('mail')) return 'envelope';
  return 'link';
};

/**
 * Contact 组件
 * @description 联系页面主组件，包含邮箱卡片、社交链接和联系表单
 * @param {Object} props - 组件属性
 * @param {Object} props.content - 页面内容数据
 * @param {Object} props.content.contact - 联系相关内容
 * @param {Object} props.content.contact.cards - 卡片内容
 * @param {Object} props.content.contact.form - 表单内容
 * @param {Object} props.content.contact.services - 服务内容
 * @param {Object} props.content.contact.actions - 操作按钮文本
 * @param {Object} props.content.contact.formLabels - 表单标签
 * @param {Object} props.content.contact.formPlaceholders - 表单占位符
 * @param {Object} props.content.contact.formOptions - 表单选项
 * @param {Object} props.content.contact.formSubmit - 表单提交相关文本
 * @returns {JSX.Element} 联系页面组件
 */
const Contact = ({ content }) => {
  const { contact } = content;
  const {
    cards,
    form: formContent,
    services,
    actions,
    formLabels,
    formPlaceholders,
    formOptions,
    formSubmit,
  } = contact;
  const form = useRef();
  const statusResetRef = useRef(null);
  const [status, setStatus] = useState('idle'); // 表单状态: idle, sending, success, error
  const [copyStatus, setCopyStatus] = useState('idle'); // 复制状态: idle, success, error
  const emailAddress = cards.email.address;

  /**
   * 安排状态重置
   * @description 设置定时器在5秒后重置表单状态
   * @returns {void}
   */
  const scheduleStatusReset = useCallback(() => {
    if (statusResetRef.current) {
      clearTimeout(statusResetRef.current);
    }
    statusResetRef.current = setTimeout(() => {
      setStatus('idle');
      statusResetRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (statusResetRef.current) {
        clearTimeout(statusResetRef.current);
      }
    };
  }, []);

  /**
   * 复制文本到剪贴板
   * @description 使用现代 Clipboard API 或传统方法复制文本
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>} 复制是否成功
   */
  const copyToClipboard = useCallback(async text => {
    if (typeof window === 'undefined') return false;
    try {
      // 优先使用现代 Clipboard API
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback: 使用 textarea + selection API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);

      // 使用现代 selection API
      const selection = document.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textarea);
      selection?.removeAllRanges();
      selection?.addRange(range);
      textarea.setSelectionRange(0, text.length);

      // 尝试使用 Clipboard API 作为最后的 fallback
      let successful = false;
      try {
        successful = await navigator.clipboard
          .writeText(text)
          .then(() => true)
          .catch(() => false);
      } catch {
        // 如果都不支持，则静默失败
        console.warn('Clipboard API not supported in this browser');
      }

      document.body.removeChild(textarea);
      return successful;
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }, []);

  /**
   * 处理邮箱复制事件
   * @description 点击复制按钮时复制邮箱地址到剪贴板
   * @param {Event} e - 点击事件对象
   * @returns {Promise<void>}
   */
  const handleCopyEmail = useCallback(
    async e => {
      e.preventDefault();
      const success = await copyToClipboard(emailAddress);
      setCopyStatus(success ? 'success' : 'error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    },
    [copyToClipboard, emailAddress]
  );

  /**
   * 发送邮件表单
   * @description 使用 EmailJS 服务发送联系表单
   * @param {Event} e - 表单提交事件
   * @returns {Promise<void>}
   */
  const sendEmail = async e => {
    e.preventDefault();
    if (status === 'sending') return;

    // Astro 使用 PUBLIC_ 前缀的环境变量
    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS environment variables are missing.');
      setStatus('error');
      scheduleStatusReset();
      return;
    }

    if (!form.current) {
      setStatus('error');
      scheduleStatusReset();
      return;
    }

    setStatus('sending');

    try {
      await emailjs.sendForm(serviceId, templateId, form.current, {
        publicKey,
      });
      setStatus('success');
      form.current.reset();
    } catch (error) {
      console.error('FAILED...', error?.text || error);
      setStatus('error');
    } finally {
      scheduleStatusReset();
    }
  };

  /**
   * 获取状态文本
   * @description 根据当前表单状态返回相应的提示文本
   * @returns {string} 状态提示文本
   */
  const statusText = useMemo(() => {
    switch (status) {
      case 'sending':
        return formSubmit?.sending || '发送中...';
      case 'success':
        return formSubmit?.success || '发送成功！我会尽快回复';
      case 'error':
        return formSubmit?.error || '发送失败，请稍后重试';
      default:
        return formSubmit?.default || '发送给 Wenjie';
    }
  }, [status, formSubmit]);

  return (
    <>
      <section className='mb-12 sm:mb-16 md:mb-20 grid md:grid-cols-2 gap-8'>
        <div className='p-8 border border-gray-200 dark:border-gray-700 rounded-3xl card-hover flex flex-col justify-between h-full group bg-white dark:bg-gray-800 relative overflow-hidden'>
          {/* 装饰背景 Icon */}
          <div className='absolute -right-6 -top-6 text-9xl text-gray-50 dark:text-gray-700 opacity-50 group-hover:opacity-100 group-hover:text-gray-100 dark:group-hover:text-gray-600 transition-all duration-500 pointer-events-none select-none'>
            <Icon name='envelope' className='w-24 h-24' />
          </div>

          <div className='relative z-10'>
            <div className='flex justify-between items-center mb-8'>
              <p className='text-xs uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500'>
                {cards.email.subtitle}
              </p>
              <span className='inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-800'>
                <span className='w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse'></span>
                Open to Connect
              </span>
            </div>

            <div className='mb-6'>
              <h3 className='text-2xl sm:text-3xl font-semibold break-all mb-3 text-gray-900 dark:text-gray-100'>
                {cards.email.address.split('@')[0]}
                <span className='text-gray-300 dark:text-gray-600'>@</span>
                {cards.email.address.split('@')[1]}
              </h3>
              <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
                {cards.email.note}
              </p>
            </div>
          </div>

          <div className='relative z-10 flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700'>
            <a
              href={`mailto:${cards.email.address}`}
              className='flex-1 bg-black dark:bg-gray-700 text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md'
            >
              {actions?.writeEmail || '写邮件'}
            </a>
            <button
              onClick={handleCopyEmail}
              className='flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            >
              {copyStatus === 'success' ? (
                <span className='text-green-600 dark:text-green-400'>
                  <Icon name='check' className='inline-block w-4 h-4 mr-2 align-[-2px]' />
                  {actions?.copied || '已复制'}
                </span>
              ) : copyStatus === 'error' ? (
                <span className='text-red-600 dark:text-red-400'>
                  <Icon name='alert' className='inline-block w-4 h-4 mr-2 align-[-2px]' />
                  {actions?.copyError || '复制失败'}
                </span>
              ) : (
                <span>
                  <Icon name='copy' className='inline-block w-4 h-4 mr-2 align-[-2px]' />
                  {actions?.copy || '复制'}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className='p-8 border border-gray-200 dark:border-gray-700 rounded-3xl card-hover bg-white dark:bg-gray-800'>
          <p className='text-xs uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 mb-6'>
            {cards.social.subtitle}
          </p>
          <ul className='space-y-3'>
            {cards.social.items.map(item => (
              <li key={item.label}>
                <a
                  href={item.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-between p-3 -mx-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-500'>
                      <Icon
                        name={getIconKindFromFa(item.icon)}
                        className='w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors'
                      />
                    </div>
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-gray-100'>{item.label}</h4>
                      {item.handle && (
                        <p className='text-xs text-gray-500 dark:text-gray-400'>{item.handle}</p>
                      )}
                    </div>
                  </div>
                  <Icon
                    name='external'
                    className='w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300'
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='mb-12 sm:mb-16 md:mb-20'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <p className='text-xs uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500'>
              {formContent.subtitle}
            </p>
            <h2 className='text-3xl font-semibold display-font'>{formContent.title}</h2>
          </div>
          <span
            className='text-sm text-gray-400 dark:text-gray-500'
            dangerouslySetInnerHTML={{ __html: formContent.note }}
          ></span>
        </div>
        <form
          ref={form}
          onSubmit={sendEmail}
          className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 space-y-6'
        >
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
            >
              {formLabels?.name || '称呼'}
            </label>
            <input
              id='name'
              name='user_name'
              type='text'
              required
              className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
              placeholder={formPlaceholders?.name || '例如：李雷 / 小团队 / 品牌方'}
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
            >
              {formLabels?.email || '邮箱'}
            </label>
            <input
              id='email'
              name='user_email'
              type='email'
              required
              className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
              placeholder={formPlaceholders?.email || 'you@example.com'}
            />
          </div>
          <div>
            <label
              htmlFor='topic'
              className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
            >
              {formLabels?.topic || '项目类型'}
            </label>
            <select
              id='topic'
              name='topic'
              className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
            >
              <option value='consulting'>{formOptions?.consulting || '产品 / 体验咨询'}</option>
              <option value='content'>{formOptions?.content || '内容共创'}</option>
              <option value='share'>{formOptions?.share || '生活交友'}</option>
              <option value='other'>{formOptions?.other || '其他想法'}</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'
            >
              {formLabels?.message || '简要说明'}
            </label>
            <textarea
              id='message'
              name='message'
              rows='5'
              required
              className='w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-500'
              placeholder={formPlaceholders?.message || '目标、时间、你期待的成果...'}
            ></textarea>
          </div>
          <button
            type='submit'
            disabled={status === 'sending' || status === 'success'}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              status === 'success'
                ? 'bg-green-600 text-white'
                : status === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-black dark:bg-gray-700 text-white card-hover'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {statusText}
          </button>
          <span className='sr-only' role='status' aria-live='polite'>
            {statusText}
          </span>
        </form>
      </section>

      <section className='mb-12 sm:mb-16 md:mb-20'>
        <div className='grid md:grid-cols-3 gap-6'>
          {services.items.map(item => (
            <article
              key={item.title}
              className='p-6 border border-gray-200 dark:border-gray-700 rounded-3xl card-hover'
            >
              <p className='text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-2'>
                {item.subtitle}
              </p>
              <h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm'>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Contact;
