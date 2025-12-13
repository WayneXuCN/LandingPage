import React from 'react';

/**
 * @fileoverview ErrorBoundary.jsx
 * @description 错误边界组件，捕获子组件的 JavaScript 错误并提供友好的错误界面
 * @author Wenjie
 * @version 1.0.0
 */

/**
 * ErrorBoundary 组件
 * @description React 错误边界类组件，用于捕获子组件树中的 JavaScript 错误
 * @class
 * @extends React.Component
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} 错误边界组件
 */
class ErrorBoundary extends React.Component {
  /**
   * 构造函数
   * @param {Object} props - 组件属性
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * 静态方法：从错误中派生状态
   * @description 当子组件抛出错误时调用，更新组件状态
   * @param {Error} _error - 捕获的错误对象
   * @returns {Object} 新的状态对象
   */
  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  /**
   * 生命周期方法：捕获错误
   * @description 当子组件抛出错误时调用，记录错误信息
   * @param {Error} error - 捕获的错误对象
   * @param {Object} errorInfo - 错误信息对象
   * @returns {void}
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  /**
   * 渲染方法
   * @description 根据错误状态渲染错误界面或子组件
   * @returns {JSX.Element} 渲染的组件
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4'>
          <div className='max-w-md w-full text-center'>
            <div className='mb-8'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4'>
                <svg
                  className='w-8 h-8 text-red-600 dark:text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>出错了</h1>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                页面遇到了一些问题,请刷新页面重试
              </p>
            </div>

            <div className='space-y-3'>
              <button
                onClick={() => window.location.reload()}
                className='w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors'
              >
                刷新页面
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className='w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                返回首页
              </button>
            </div>

            {/* 开发环境显示错误详情 - 使用 import.meta.env.DEV */}
            {import.meta.env.DEV && this.state.error && (
              <details className='mt-6 text-left'>
                <summary className='cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'>
                  查看错误详情
                </summary>
                <div className='mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 overflow-auto'>
                  <p className='font-bold mb-2'>{this.state.error.toString()}</p>
                  <pre className='whitespace-pre-wrap text-gray-600 dark:text-gray-400'>
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
