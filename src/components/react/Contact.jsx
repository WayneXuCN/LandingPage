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
 * @description 渲染不同类型的 SVG 图标（纸墨风格下仅保留表单操作所需的极简线性图标）
 * @param {Object} props - 组件属性
 * @param {string} props.name - 图标名称，支持 'check', 'alert', 'copy'
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
    default:
      return null;
  }
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

      // 使用旧式 copy 命令作为最后的 fallback
      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (copyError) {
        console.warn('Clipboard copy failed:', copyError);
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
      {/* 邮箱 + 社交：名片/通讯笺式左右极简排版，无卡片盒 */}
      <section className='mb-12 sm:mb-16 md:mb-20 grid md:grid-cols-[5fr_4fr] gap-10 lg:gap-16'>
        {/* 左：邮箱通讯笺 */}
        <div className='flex flex-col justify-between h-full border-t border-hairline pt-8'>
          <div>
            <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mb-8'>
              <p className='eyebrow text-vermilion text-xs'>{cards.email.subtitle}</p>
              <span className='inline-flex items-center font-mono uppercase tracking-[0.15em] text-xs text-inksoft'>
                <span className='w-1.5 h-1.5 rounded-full bg-vermilion mr-2 animate-pulse'></span>
                Open to Connect
              </span>
            </div>

            <div className='mb-6'>
              <h3 className='display-font text-2xl sm:text-3xl font-normal break-all mb-4 text-ink'>
                {cards.email.address.split('@')[0]}
                <span className='text-inksoft/50'>@</span>
                {cards.email.address.split('@')[1]}
              </h3>
              <p className='text-inksoft text-sm leading-[1.85] tracking-[0.02em]'>
                {cards.email.note}
              </p>
            </div>
          </div>

          {/* 操作：括号式文字链接，悬停下划线展开 */}
          <div className='flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 mt-8 border-t border-hairline'>
            <a
              href={`mailto:${cards.email.address}`}
              className='link-underline inline-flex items-baseline gap-1.5 text-ink hover:text-vermilion transition-colors'
            >
              <span className='text-inksoft' aria-hidden='true'>
                [
              </span>
              {actions?.writeEmail || '写邮件'}
              <span aria-hidden='true'>&rarr;</span>
              <span className='text-inksoft' aria-hidden='true'>
                ]
              </span>
            </a>
            <button
              onClick={handleCopyEmail}
              className='link-underline inline-flex items-baseline gap-1.5 text-ink hover:text-vermilion transition-colors focus:outline-none'
            >
              <span className='text-inksoft' aria-hidden='true'>
                [
              </span>
              {copyStatus === 'success' ? (
                <span className='inline-flex items-center gap-1.5'>
                  <Icon name='check' className='inline-block w-4 h-4 self-center' />
                  {actions?.copied || '已复制'}
                </span>
              ) : copyStatus === 'error' ? (
                <span className='inline-flex items-center gap-1.5'>
                  <Icon name='alert' className='inline-block w-4 h-4 self-center' />
                  {actions?.copyError || '复制失败'}
                </span>
              ) : (
                <span className='inline-flex items-center gap-1.5'>
                  <Icon name='copy' className='inline-block w-4 h-4 self-center' />
                  {actions?.copy || '复制'}
                </span>
              )}
              <span className='text-inksoft' aria-hidden='true'>
                ]
              </span>
            </button>
          </div>
        </div>

        {/* 右：社交平台单列文字行，发丝线分隔 */}
        <div className='border-t border-hairline pt-8'>
          <p className='eyebrow text-vermilion text-xs mb-4'>{cards.social.subtitle}</p>
          <ul>
            {cards.social.items.map(item => (
              <li key={item.label} className='border-b border-hairline last:border-b-0'>
                <a
                  href={item.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex items-center justify-between py-4 transition-colors'
                >
                  <div>
                    <h4 className='font-medium text-ink group-hover:text-vermilion transition-colors'>
                      {item.label}
                    </h4>
                    {item.handle && (
                      <p className='font-mono text-xs text-inksoft mt-0.5'>{item.handle}</p>
                    )}
                  </div>
                  <span
                    aria-hidden='true'
                    className='text-lg leading-none text-inksoft/60 group-hover:text-vermilion transition-colors'
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 表单：底线式信笺 */}
      <section className='mb-12 sm:mb-16 md:mb-20'>
        <div className='flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-10'>
          <div>
            <p className='eyebrow text-vermilion text-xs mb-2'>
              {formContent.subtitle}
            </p>
            <h2 className='text-3xl font-normal display-font'>{formContent.title}</h2>
          </div>
          <span
            className='text-sm text-inksoft rich-text'
            dangerouslySetInnerHTML={{ __html: formContent.note }}
          ></span>
        </div>
        <form ref={form} onSubmit={sendEmail} className='space-y-8 max-w-3xl'>
          <div>
            <label
              htmlFor='name'
              className='block text-xs tracking-[0.2em] text-inksoft mb-1'
            >
              {formLabels?.name || '称呼'}
            </label>
            <input
              id='name'
              name='user_name'
              type='text'
              required
              className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors placeholder:text-inksoft/50'
              placeholder={formPlaceholders?.name || '例如：李雷 / 小团队 / 品牌方'}
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-xs tracking-[0.2em] text-inksoft mb-1'
            >
              {formLabels?.email || '邮箱'}
            </label>
            <input
              id='email'
              name='user_email'
              type='email'
              required
              className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors placeholder:text-inksoft/50'
              placeholder={formPlaceholders?.email || 'you@example.com'}
            />
          </div>
          <div>
            <label
              htmlFor='topic'
              className='block text-xs tracking-[0.2em] text-inksoft mb-1'
            >
              {formLabels?.topic || '项目类型'}
            </label>
            <select
              id='topic'
              name='topic'
              className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors'
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
              className='block text-xs tracking-[0.2em] text-inksoft mb-1'
            >
              {formLabels?.message || '简要说明'}
            </label>
            <textarea
              id='message'
              name='message'
              rows='5'
              required
              className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors resize-none placeholder:text-inksoft/50'
              placeholder={formPlaceholders?.message || '目标、时间、你期待的成果...'}
            ></textarea>
          </div>
          <button
            type='submit'
            disabled={status === 'sending' || status === 'success'}
            className={`inline-flex w-full sm:w-auto justify-center items-center border px-8 py-3 text-sm tracking-[0.15em] transition-colors ${
              status === 'success' || status === 'error'
                ? 'border-vermilion text-vermilion'
                : 'border-ink text-ink hover:bg-ink hover:text-paper'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {statusText}
          </button>
          <span className='sr-only' role='status' aria-live='polite'>
            {statusText}
          </span>
        </form>
      </section>

      {/* 服务：折页目录式栏目，发丝线上边线 + 西文序号 */}
      <section className='mb-12 sm:mb-16 md:mb-20'>
        <div className='grid md:grid-cols-3 gap-x-10 gap-y-8'>
          {services.items.map((item, index) => (
            <article key={item.title} className='border-t border-hairline pt-6'>
              <p className='font-display italic text-vermilion text-sm mb-3'>
                No. 0{index + 1}
              </p>
              <p className='eyebrow text-inksoft text-xs mb-2'>
                {item.subtitle}
              </p>
              <h3 className='text-xl font-normal display-font mb-2'>{item.title}</h3>
              <p className='text-inksoft text-sm leading-relaxed'>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Contact;
