// --------------------
// 常量与工具方法
// --------------------
const CONTENT_URL = 'content.json';

const DEFAULT_CONTENT = {
    site: {
        title: "Wenjie Xu - Personal Website",
        author: "徐文杰",
        favicon: {
            ico: "favicon.ico",
            appleTouchIcon: "apple-touch-icon.png"
        }
    },
    header: {
        avatar: "https://picsum.photos/seed/avatar123/50/50.jpg",
        name: "徐文杰"
    },
    hero: {
        subtitle: "WENJIE XU",
        title: "保持好奇 也保持自在",
        description: "Join us and witness every step as a one-person company grows from chaos to clarity — with <span class=\"underline\">MDFriday</span> as the engine behind it.",

    },
    websites: {
        title: "Websites",
        items: []
    },
    featuredPosts: {
        title: "Featured Posts",
        items: [],
        seeAllText: "See All Posts",
        seeAllUrl: "#"
    },
    footer: {
        copyright: "© 2025 All Rights Reserved.",
        socialLinks: []
    }
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const NAV_LINKS = [
    { label: '首页', href: 'index.html' },
    { label: '关于', href: 'about.html' },
    { label: '联系', href: 'contact.html' }
];

// 深度合并：保证缺省字段有值
const mergeContent = (data = {}) => {
    const mergeSection = (section = {}, fallback = {}) => ({
        ...fallback,
        ...section
    });

    const mergeListSection = (section = {}, fallback = {}) => ({
        ...mergeSection(section, fallback),
        items: Array.isArray(section.items) ? section.items : fallback.items
    });

    const site = mergeSection(data.site, DEFAULT_CONTENT.site);
    const header = mergeSection(data.header, DEFAULT_CONTENT.header);
    const hero = mergeSection(data.hero, DEFAULT_CONTENT.hero);
    const websites = mergeListSection(data.websites, DEFAULT_CONTENT.websites);
    const featuredPosts = {
        ...mergeListSection(data.featuredPosts, DEFAULT_CONTENT.featuredPosts),
        seeAllText: data.featuredPosts?.seeAllText ?? DEFAULT_CONTENT.featuredPosts.seeAllText,
        seeAllUrl: data.featuredPosts?.seeAllUrl ?? DEFAULT_CONTENT.featuredPosts.seeAllUrl
    };
    const footer = {
        ...mergeSection(data.footer, DEFAULT_CONTENT.footer),
        socialLinks: Array.isArray(data.footer?.socialLinks)
            ? data.footer.socialLinks
            : DEFAULT_CONTENT.footer.socialLinks
    };

    return { site, header, hero, websites, featuredPosts, footer };
};

// 更新 favicon，确保移动端与桌面端一致
const applyFavicon = (faviconConfig = {}) => {
    const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
    existingLinks.forEach((link) => link.remove());

    const head = document.head;

    if (faviconConfig.ico) {
        const icoLink = document.createElement('link');
        icoLink.rel = 'icon';
        icoLink.type = 'image/x-icon';
        icoLink.href = faviconConfig.ico;
        head.appendChild(icoLink);
    }

    if (faviconConfig.appleTouchIcon) {
        const appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        appleLink.sizes = '180x180';
        appleLink.href = faviconConfig.appleTouchIcon;
        head.appendChild(appleLink);
    }
};

// 异步读取内容
const fetchSiteContent = async () => {
    try {
        const response = await fetch(CONTENT_URL, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`请求失败：${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载内容时发生错误，已回退到内置副本：', error);
        return clone(DEFAULT_CONTENT);
    }
};

// --------------------
// React 组件
// --------------------
const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
};

const PrimaryNav = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const isActive = (href) => {
        if (!currentPath) return false;
        if (href === 'index.html') {
            return currentPath === '/' || currentPath.endsWith('/index.html');
        }
        return currentPath.endsWith(`/${href}`);
    };

    return (
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
            {NAV_LINKS.map((link, index) => (
                <React.Fragment key={link.href}>
                    {index > 0 && <span className="text-gray-300">/</span>}
                    <a
                        href={link.href}
                        className={`transition-colors ${isActive(link.href) ? 'text-gray-900' : 'hover:text-gray-900'}`}
                    >
                        {link.label}
                    </a>
                </React.Fragment>
            ))}
        </nav>
    );
};

const HeaderBar = ({ header }) => (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 sm:mb-16 md:mb-20">
        <div className="flex items-center">
            <img src={header.avatar} alt={header.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-4" loading="lazy" />
            <span className="font-medium text-gray-800 text-lg">{header.name}</span>
        </div>
        <PrimaryNav />
    </header>
);

const WebsiteItem = ({ item }) => {
    const handleClick = () => openInNewTab(item.url);

    return (
        <div className="relative overflow-hidden rounded-lg shadow-md card-hover portfolio-item website-item" onClick={handleClick}>
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black bg-opacity-40 card-overlay transition-all duration-300 flex flex-col p-6">
                <div>
                    <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white text-sm opacity-0 transition-opacity duration-300 website-description-text transform translate-y-2 transition-transform duration-300">
                        {item.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FeaturedPostItem = ({ item }) => (
    <div className="relative overflow-hidden rounded-lg shadow-md card-hover featured-post-item website-item" onClick={() => openInNewTab(item.url)}>
        <img src={item.image} alt={item.title} className="w-full h-64 object-cover" loading="lazy" />
        <div className={`absolute inset-0 ${item.overlayColor} ${item.overlayOpacity} card-overlay transition-all duration-300 flex flex-col p-6`}>
            <div>
                <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white text-sm opacity-0 transition-opacity duration-300 website-description-text transform translate-y-2 transition-transform duration-300">
                    {item.description}
                </p>
            </div>
        </div>
    </div>
);

const SocialLink = ({ link }) => (
    <a
        href={link.url}
        className="text-gray-600 hover:text-gray-900 transition-colors social-icon text-xl"
        title={link.title || ''}
    >
        {link.imageUrl ? (
            <img src={link.imageUrl} alt={link.title || 'social-icon'} className="w-full h-full object-contain" loading="lazy" />
        ) : (
            <i className={link.icon}></i>
        )}
    </a>
);

const App = () => {
    const [content, setContent] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;

        const bootstrap = async () => {
            const remoteContent = await fetchSiteContent();
            if (!isMounted) return;

            const safeContent = mergeContent(remoteContent);
            applyFavicon(safeContent.site?.favicon);
            setContent(safeContent);
            setIsLoading(false);
        };

        bootstrap();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading || !content) {
        return <div className="flex justify-center items-center h-screen text-gray-600">内容加载中...</div>;
    }

    const { header, hero, websites, featuredPosts, footer } = content;

    return (
        <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
            {/* 头部信息 */}
            <HeaderBar header={header} />

            {/* Hero 区块 */}
            <section className="mb-12 sm:mb-16 md:mb-20">
                <h1 className="text-red-500 text-sm font-bold mb-4 sm:mb-6 tracking-widest">{hero.subtitle}</h1>
                <h2
                    className="text-6xl font-bold mb-8 sm:mb-10 leading-tight display-font tracking-tight"
                    dangerouslySetInnerHTML={{ __html: hero.title }}
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 700 }}
                ></h2>
                <p className="text-xl sm:text-2xl mb-6 sm:mb-8 text-gray-700 max-w-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: hero.description }}></p>

            </section>

            {/* Websites 区块 */}
            <section className="mb-12 sm:mb-16 md:mb-20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font">{websites.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {websites.items.map((item) => (
                        <WebsiteItem key={item.id || item.title} item={item} />
                    ))}
                </div>
            </section>

            {/* Featured Posts 区块 */}
            <section className="mb-12 sm:mb-16 md:mb-20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font">{featuredPosts.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {featuredPosts.items.map((item) => (
                        <FeaturedPostItem key={item.id || item.title} item={item} />
                    ))}
                </div>
                <div className="flex justify-end mt-8 sm:mt-10">
                    <a
                        href={featuredPosts.seeAllUrl}
                        className="text-pink-500 font-medium flex items-center hover:text-pink-600 transition-colors text-base sm:text-lg"
                    >
                        {featuredPosts.seeAllText} <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </section>

            {/* 页脚 */}
            <footer className="pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-gray-200">
                <div className="flex justify-between items-center flex-col md:flex-row gap-6 md:gap-0">
                    <p className="text-gray-600 text-base sm:text-lg text-center md:text-left">{footer.copyright}</p>
                    <div className="flex space-x-4 sm:space-x-6">
                        {footer.socialLinks.map((link) => (
                            <SocialLink key={link.url} link={link} />
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --------------------
// 启动渲染
// --------------------
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);