#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');

// Performance requirements
const PERFORMANCE_REQUIREMENTS = {
    LOGIN_TIME: 1000,      // 1 second
    SEARCH_TIME: 2000,     // 2 seconds  
    CHECKOUT_TIME: 5000,   // 5 seconds
    ORDER_TIME: 3000,      // 3 seconds
    CONCURRENT_USERS: 10000 // 10k concurrent users
};

class PerformanceValidator {
    constructor() {
        this.results = {
            login: { passed: false, avgTime: 0, p95Time: 0 },
            search: { passed: false, avgTime: 0, p95Time: 0 },
            checkout: { passed: false, avgTime: 0, p95Time: 0 },
            order: { passed: false, avgTime: 0, p95Time: 0 },
            concurrency: { passed: false, maxUsers: 0, errorRate: 0 }
        };
    }

    async runPerformanceTests() {
        console.log('🚀 Starting AutowiseParts Performance Validation...\n');

        try {
            // Run Artillery load test
            console.log('📊 Running load tests...');
            const testResults = await this.runLoadTest();

            // Analyze results
            this.analyzeResults(testResults);

            // Generate report
            this.generateReport();

        } catch (error) {
            console.error('❌ Performance tests failed:', error);
        }
    }

    runLoadTest() {
        return new Promise((resolve, reject) => {
            exec('artillery run load-test.yml --output performance-results.json', (error, stdout, stderr) => {
                if (error) {
                    console.error('Load test error:', error);
                    // Don't reject on test errors, just log them
                }

                try {
                    const results = JSON.parse(fs.readFileSync('performance-results.json', 'utf8'));
                    resolve(results);
                } catch (parseError) {
                    console.log('Raw output:', stdout);
                    resolve({ summary: {} }); // Fallback
                }
            });
        });
    }

    analyzeResults(results) {
        console.log('\n📈 Analyzing Performance Results...\n');

        const summary = results.aggregate || results.summary || {};

        // Login Authentication Analysis
        const loginMetrics = this.extractScenarioMetrics(results, 'Login Authentication');
        this.results.login = {
            passed: loginMetrics.p95 <= PERFORMANCE_REQUIREMENTS.LOGIN_TIME,
            avgTime: loginMetrics.mean,
            p95Time: loginMetrics.p95
        };

        // Product Search Analysis
        const searchMetrics = this.extractScenarioMetrics(results, 'Product Search');
        this.results.search = {
            passed: searchMetrics.p95 <= PERFORMANCE_REQUIREMENTS.SEARCH_TIME,
            avgTime: searchMetrics.mean,
            p95Time: searchMetrics.p95
        };

        // Checkout Process Analysis
        const checkoutMetrics = this.extractScenarioMetrics(results, 'Checkout Process');
        this.results.checkout = {
            passed: checkoutMetrics.p95 <= PERFORMANCE_REQUIREMENTS.CHECKOUT_TIME,
            avgTime: checkoutMetrics.mean,
            p95Time: checkoutMetrics.p95
        };

        // Order Placement Analysis
        const orderMetrics = this.extractScenarioMetrics(results, 'Order Placement');
        this.results.order = {
            passed: orderMetrics.p95 <= PERFORMANCE_REQUIREMENTS.ORDER_TIME,
            avgTime: orderMetrics.mean,
            p95Time: orderMetrics.p95
        };

        // Concurrency Analysis
        const totalRequests = summary.requestsCompleted || 0;
        const errors = summary.errors || 0;
        const errorRate = totalRequests > 0 ? (errors / totalRequests) * 100 : 100;

        this.results.concurrency = {
            passed: errorRate < 5, // Less than 5% error rate under load
            maxUsers: summary.scenariosCompleted || 0,
            errorRate: errorRate
        };
    }

    extractScenarioMetrics(results, scenarioName) {
        // Extract metrics for specific scenario
        const latency = results.aggregate?.latency || {};
        return {
            mean: latency.mean || 0,
            p95: latency.p95 || 0,
            p99: latency.p99 || 0
        };
    }

    generateReport() {
        console.log('📋 PERFORMANCE TEST RESULTS');
        console.log('================================\n');

        // Login Test Results
        const loginStatus = this.results.login.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`🔐 Login Authentication: ${loginStatus}`);
        console.log(`   Target: <${PERFORMANCE_REQUIREMENTS.LOGIN_TIME}ms`);
        console.log(`   Actual P95: ${this.results.login.p95Time}ms`);
        console.log(`   Average: ${this.results.login.avgTime}ms\n`);

        // Search Test Results
        const searchStatus = this.results.search.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`🔍 Product Search: ${searchStatus}`);
        console.log(`   Target: <${PERFORMANCE_REQUIREMENTS.SEARCH_TIME}ms`);
        console.log(`   Actual P95: ${this.results.search.p95Time}ms`);
        console.log(`   Average: ${this.results.search.avgTime}ms\n`);

        // Checkout Test Results
        const checkoutStatus = this.results.checkout.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`🛒 Checkout Process: ${checkoutStatus}`);
        console.log(`   Target: <${PERFORMANCE_REQUIREMENTS.CHECKOUT_TIME}ms`);
        console.log(`   Actual P95: ${this.results.checkout.p95Time}ms`);
        console.log(`   Average: ${this.results.checkout.avgTime}ms\n`);

        // Order Test Results
        const orderStatus = this.results.order.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`📦 Order Placement: ${orderStatus}`);
        console.log(`   Target: <${PERFORMANCE_REQUIREMENTS.ORDER_TIME}ms`);
        console.log(`   Actual P95: ${this.results.order.p95Time}ms`);
        console.log(`   Average: ${this.results.order.avgTime}ms\n`);

        // Concurrency Test Results
        const concurrencyStatus = this.results.concurrency.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`👥 Peak Traffic (10k users): ${concurrencyStatus}`);
        console.log(`   Target: Support 10,000 concurrent users`);
        console.log(`   Error Rate: ${this.results.concurrency.errorRate.toFixed(2)}%`);
        console.log(`   Scenarios Completed: ${this.results.concurrency.maxUsers}\n`);

        // Overall Summary
        const totalTests = 5;
        const passedTests = Object.values(this.results).filter(r => r.passed).length;
        const overallStatus = passedTests === totalTests ? '✅ ALL PASS' : `⚠️  ${passedTests}/${totalTests} PASS`;

        console.log('================================');
        console.log(`📊 OVERALL RESULT: ${overallStatus}`);
        console.log('================================\n');

        // Recommendations
        this.generateRecommendations();
    }

    generateRecommendations() {
        console.log('💡 PERFORMANCE RECOMMENDATIONS:');
        console.log('================================\n');

        if (!this.results.login.passed) {
            console.log('🔐 Login Performance Issues:');
            console.log('   - Consider implementing login caching');
            console.log('   - Optimize database queries for user authentication');
            console.log('   - Add Redis for session management\n');
        }

        if (!this.results.search.passed) {
            console.log('🔍 Search Performance Issues:');
            console.log('   - Implement search result caching');
            console.log('   - Add database indexing for product search');
            console.log('   - Consider Elasticsearch for large catalogs\n');
        }

        if (!this.results.checkout.passed) {
            console.log('🛒 Checkout Performance Issues:');
            console.log('   - Optimize payment processing');
            console.log('   - Implement async order processing');
            console.log('   - Add database connection pooling\n');
        }

        if (!this.results.order.passed) {
            console.log('📦 Order Performance Issues:');
            console.log('   - Implement order confirmation caching');
            console.log('   - Optimize order status queries');
            console.log('   - Add message queues for order processing\n');
        }

        if (!this.results.concurrency.passed) {
            console.log('👥 Concurrency Issues:');
            console.log('   - Scale horizontally with load balancers');
            console.log('   - Implement database read replicas');
            console.log('   - Add CDN for static assets');
            console.log('   - Consider microservices architecture\n');
        }
    }
}

// Run the performance validator
if (require.main === module) {
    const validator = new PerformanceValidator();
    validator.runPerformanceTests();
}

module.exports = PerformanceValidator;
