// Performance monitoring utility for AutowiseParts
export const performanceMonitor = {
    // Performance requirements
    REQUIREMENTS: {
        LOGIN_TIME: 1000,      // Login within 1 second
        SEARCH_TIME: 2000,     // Product search within 2 seconds
        CHECKOUT_TIME: 5000,   // Checkout within 5 seconds
        ORDER_TIME: 3000,      // Order placement within 3 seconds
    },

    // Measure specific user actions
    measureLoginPerformance(loginFunction) {
        const startTime = performance.now();

        return loginFunction().then(result => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            const status = duration <= this.REQUIREMENTS.LOGIN_TIME ? '✅ PASS' : '❌ FAIL';
            console.log(`🔐 Login Performance: ${status}`);
            console.log(`   Time: ${duration.toFixed(2)}ms (Target: <${this.REQUIREMENTS.LOGIN_TIME}ms)`);

            // Send to analytics
            this.trackMetric('login_performance', duration, this.REQUIREMENTS.LOGIN_TIME);

            return { result, duration, passed: duration <= this.REQUIREMENTS.LOGIN_TIME };
        }).catch(error => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.error('Login failed:', error, `Time: ${duration.toFixed(2)}ms`);
            throw error;
        });
    },

    measureSearchPerformance(searchFunction) {
        const startTime = performance.now();

        return searchFunction().then(result => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            const status = duration <= this.REQUIREMENTS.SEARCH_TIME ? '✅ PASS' : '❌ FAIL';
            console.log(`🔍 Search Performance: ${status}`);
            console.log(`   Time: ${duration.toFixed(2)}ms (Target: <${this.REQUIREMENTS.SEARCH_TIME}ms)`);
            console.log(`   Results: ${Array.isArray(result) ? result.length : 'N/A'} items`);

            this.trackMetric('search_performance', duration, this.REQUIREMENTS.SEARCH_TIME);

            return { result, duration, passed: duration <= this.REQUIREMENTS.SEARCH_TIME };
        });
    },

    measureCheckoutPerformance(checkoutFunction) {
        const startTime = performance.now();

        return checkoutFunction().then(result => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            const status = duration <= this.REQUIREMENTS.CHECKOUT_TIME ? '✅ PASS' : '❌ FAIL';
            console.log(`🛒 Checkout Performance: ${status}`);
            console.log(`   Time: ${duration.toFixed(2)}ms (Target: <${this.REQUIREMENTS.CHECKOUT_TIME}ms)`);

            this.trackMetric('checkout_performance', duration, this.REQUIREMENTS.CHECKOUT_TIME);

            return { result, duration, passed: duration <= this.REQUIREMENTS.CHECKOUT_TIME };
        });
    },

    measureOrderPerformance(orderFunction) {
        const startTime = performance.now();

        return orderFunction().then(result => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            const status = duration <= this.REQUIREMENTS.ORDER_TIME ? '✅ PASS' : '❌ FAIL';
            console.log(`📦 Order Performance: ${status}`);
            console.log(`   Time: ${duration.toFixed(2)}ms (Target: <${this.REQUIREMENTS.ORDER_TIME}ms)`);

            this.trackMetric('order_performance', duration, this.REQUIREMENTS.ORDER_TIME);

            return { result, duration, passed: duration <= this.REQUIREMENTS.ORDER_TIME };
        });
    },

    // Track performance metrics
    trackMetric(metricName, duration, target) {
        const metric = {
            name: metricName,
            duration: duration,
            target: target,
            passed: duration <= target,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        // Store in localStorage for analysis
        const metrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
        metrics.push(metric);

        // Keep only last 100 metrics
        if (metrics.length > 100) {
            metrics.splice(0, metrics.length - 100);
        }

        localStorage.setItem('performanceMetrics', JSON.stringify(metrics));

        // Send to analytics endpoint (if available)
        if (window.analytics && typeof window.analytics.track === 'function') {
            window.analytics.track('Performance Metric', metric);
        }
    },

    // Get performance report
    getPerformanceReport() {
        const metrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');

        const report = {
            login: this.analyzeMetrics(metrics.filter(m => m.name === 'login_performance')),
            search: this.analyzeMetrics(metrics.filter(m => m.name === 'search_performance')),
            checkout: this.analyzeMetrics(metrics.filter(m => m.name === 'checkout_performance')),
            order: this.analyzeMetrics(metrics.filter(m => m.name === 'order_performance'))
        };

        console.table(report);
        return report;
    },

    analyzeMetrics(metrics) {
        if (metrics.length === 0) return { count: 0, avg: 0, min: 0, max: 0, passRate: 0 };

        const durations = metrics.map(m => m.duration);
        const passed = metrics.filter(m => m.passed).length;

        return {
            count: metrics.length,
            avg: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            passRate: (passed / metrics.length) * 100
        };
    },
    // Measure page load time
    measurePageLoad() {
        if (performance && performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page Load Time: ${loadTime}ms`);

            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            console.log(`DOM Ready Time: ${domReady}ms`);

            const firstPaint = timing.responseEnd - timing.requestStart;
            console.log(`First Paint Time: ${firstPaint}ms`);

            return {
                loadTime,
                domReady,
                firstPaint
            };
        }
    },

    // Measure component render time
    measureRender(componentName, renderFunction) {
        const startTime = performance.now();
        const result = renderFunction();
        const endTime = performance.now();

        console.log(`${componentName} render time: ${endTime - startTime}ms`);
        return result;
    },

    // Monitor memory usage
    monitorMemory() {
        if (performance && performance.memory) {
            const memory = performance.memory;
            console.log('Memory Usage:', {
                used: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
                total: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
                limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`
            });
            return memory;
        }
    },

    // Log Core Web Vitals
    logCoreWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`FCP: ${entry.startTime}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log(`LCP: ${lastEntry.startTime}ms`);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
};

// Auto-initialize performance monitoring
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        performanceMonitor.measurePageLoad();
        performanceMonitor.monitorMemory();
        performanceMonitor.logCoreWebVitals();
    });
}
