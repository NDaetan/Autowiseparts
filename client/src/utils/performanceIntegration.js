// Example: How to integrate performance monitoring in your React components

import { performanceMonitor } from '../utils/performance';
import { loginUser, searchProducts, processCheckout, placeOrder } from '../services/api';

// Example: Login Component with Performance Monitoring
export const handleLoginWithMonitoring = async (credentials) => {
    try {
        const result = await performanceMonitor.measureLoginPerformance(() =>
            loginUser(credentials)
        );

        if (result.passed) {
            console.log('✅ Login performance meets requirements!');
        } else {
            console.warn('⚠️ Login is slower than 1 second target');
        }

        return result.result;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

// Example: Search Component with Performance Monitoring
export const handleSearchWithMonitoring = async (searchQuery) => {
    try {
        const result = await performanceMonitor.measureSearchPerformance(() =>
            searchProducts(searchQuery)
        );

        if (result.passed) {
            console.log('✅ Search performance meets requirements!');
        } else {
            console.warn('⚠️ Search is slower than 2 second target');
        }

        return result.result;
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
};

// Example: Checkout Component with Performance Monitoring
export const handleCheckoutWithMonitoring = async (checkoutData) => {
    try {
        const result = await performanceMonitor.measureCheckoutPerformance(() =>
            processCheckout(checkoutData)
        );

        if (result.passed) {
            console.log('✅ Checkout performance meets requirements!');
        } else {
            console.warn('⚠️ Checkout is slower than 5 second target');
        }

        return result.result;
    } catch (error) {
        console.error('Checkout failed:', error);
        throw error;
    }
};

// Example: Order Component with Performance Monitoring
export const handleOrderWithMonitoring = async (orderData) => {
    try {
        const result = await performanceMonitor.measureOrderPerformance(() =>
            placeOrder(orderData)
        );

        if (result.passed) {
            console.log('✅ Order performance meets requirements!');
        } else {
            console.warn('⚠️ Order placement is slower than 3 second target');
        }

        return result.result;
    } catch (error) {
        console.error('Order placement failed:', error);
        throw error;
    }
};

// Example: Performance Dashboard Hook
export const usePerformanceDashboard = () => {
    const [performanceReport, setPerformanceReport] = useState(null);

    useEffect(() => {
        const report = performanceMonitor.getPerformanceReport();
        setPerformanceReport(report);
    }, []);

    return performanceReport;
};

// Example: Performance Alert Component
export const PerformanceAlerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const checkPerformance = () => {
            const report = performanceMonitor.getPerformanceReport();
            const newAlerts = [];

            if (report.login.passRate < 90) {
                newAlerts.push('⚠️ Login performance below 90% success rate');
            }

            if (report.search.passRate < 90) {
                newAlerts.push('⚠️ Search performance below 90% success rate');
            }

            if (report.checkout.passRate < 95) {
                newAlerts.push('❌ Checkout performance critical - below 95% success rate');
            }

            if (report.order.passRate < 95) {
                newAlerts.push('❌ Order performance critical - below 95% success rate');
            }

            setAlerts(newAlerts);
        };

        // Check performance every 30 seconds
        const interval = setInterval(checkPerformance, 30000);
        checkPerformance(); // Initial check

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="performance-alerts">
            {alerts.map((alert, index) => (
                <div key={index} className="alert alert-warning">
                    {alert}
                </div>
            ))}
        </div>
    );
};
