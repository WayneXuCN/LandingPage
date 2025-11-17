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
        title: "少工作，多赚钱。<br />享受生活！",
        description: "Join us and witness every step as a one-person company grows from chaos to clarity — with <span class=\"underline\">MDFriday</span> as the engine behind it.",

    },
    portfolio: {
        title: "Portfolio",
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
    const portfolio = mergeListSection(data.portfolio, DEFAULT_CONTENT.portfolio);
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

    return { site, header, hero, portfolio, featuredPosts, footer };
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

const PortfolioItem = ({ item }) => {
    const handleClick = () => openInNewTab(item.url);

    if (item.type === 'colorful') {
        const colors = Array.isArray(item.colors) ? item.colors : [];
        return (
            <div className="relative overflow-hidden rounded-lg shadow-md card-hover portfolio-item" onClick={handleClick}>
                <div className="w-full h-64 bg-purple-900 flex flex-col">
                    {colors.map((color, index) => (
                        <div key={`${item.id}-${index}`} className={`h-1/6 ${color}`}></div>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-start p-6">
                    <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-lg shadow-md card-hover portfolio-item" onClick={handleClick}>
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black bg-opacity-40 card-overlay flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
            </div>
        </div>
    );
};

const FeaturedPostItem = ({ item }) => (
    <div className="relative overflow-hidden rounded-lg shadow-md card-hover featured-post-item" onClick={() => openInNewTab(item.url)}>
        <img src={item.image} alt={item.title} className="w-full h-64 object-cover" loading="lazy" />
        <div className={`absolute inset-0 ${item.overlayColor} ${item.overlayOpacity} card-overlay flex items-start p-6`}>
            <h3 className="text-white text-xl font-bold">{item.title}</h3>
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

    const { header, hero, portfolio, featuredPosts, footer } = content;

    return (
        <div className="max-w-screen-lg mx-auto px-6 py-12">
            {/* 头部信息 */}
            <header className="flex justify-between items-center mb-20">
                <div className="flex items-center">
                    <img src={header.avatar} alt={header.name} className="w-14 h-14 rounded-full mr-4" loading="lazy" />
                    <span className="font-medium text-gray-800 text-lg">{header.name}</span>
                </div>
            </header>

            {/* Hero 区块 */}
            <section className="mb-32">
                <h1 className="text-red-500 text-sm font-bold mb-6 tracking-widest">{hero.subtitle}</h1>
                <h2
                    className="text-6xl font-bold mb-8 leading-tight display-font tracking-tight"
                    dangerouslySetInnerHTML={{ __html: hero.title }}
                    style={{ fontSize: 'clamp(3.5rem, 10vw, 5.5rem)', fontWeight: 700 }}
                ></h2>
                <p className="text-2xl mb-6 text-gray-700 max-w-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: hero.description }}></p>

            </section>

            {/* Portfolio 区块 */}
            <section className="mb-32">
                <h2 className="text-3xl font-bold mb-8 display-font">{portfolio.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolio.items.map((item) => (
                        <PortfolioItem key={item.id || item.title} item={item} />
                    ))}
                </div>
            </section>

            {/* Featured Posts 区块 */}
            <section className="mb-32">
                <h2 className="text-3xl font-bold mb-8 display-font">{featuredPosts.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredPosts.items.map((item) => (
                        <FeaturedPostItem key={item.id || item.title} item={item} />
                    ))}
                </div>
                <div className="flex justify-end mt-8">
                    <a
                        href={featuredPosts.seeAllUrl}
                        className="text-pink-500 font-medium flex items-center hover:text-pink-600 transition-colors text-lg"
                    >
                        {featuredPosts.seeAllText} <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </section>

            {/* 页脚 */}
            <footer className="py-12 border-t border-gray-200">
                <div className="flex justify-between items-center flex-col md:flex-row gap-6 md:gap-0">
                    <p className="text-gray-600 text-lg text-center md:text-left">{footer.copyright}</p>
                    <div className="flex space-x-6">
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