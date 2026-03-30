const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
    token: localStorage.getItem('token'),

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 unauthorized
                if (response.status === 401) {
                    this.clearToken();
                    if (window.location.pathname !== '/login.html') {
                        window.location.href = '/login.html';
                    }
                }
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    },

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated() {
        return !!this.token;
    },

    async validateToken() {
        if (!this.token) return false;
        try {
            await this.request('/auth/me');
            return true;
        } catch (error) {
            this.clearToken();
            return false;
        }
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    auth: {
        async register(name, email, password) {
            const data = await api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            api.setToken(data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Sync cart after register to merge local items with server
            if (window.cart) {
                await window.cart.sync();
            }

            return data;
        },

        async login(email, password) {
            const data = await api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            api.setToken(data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Sync cart after login to merge local items with server
            if (window.cart) {
                await window.cart.sync();
            }

            return data;
        },

        logout() {
            // Clear cart from localStorage and memory on logout
            // Items added while logged in are saved in the SERVER account only
            localStorage.removeItem('cart');
            if (window.cart) {
                window.cart.items = [];
                window.cart.subtotal = 0;
                window.cart.updateBadge();
            }
            api.clearToken();
            window.location.href = 'index.html';
        },

        async forgotPassword(email) {
            return api.request('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        }
    },

    products: {
        async getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return api.request(`/products${query ? '?' + query : ''}`);
        },

        async getFeatured() {
            return api.request('/products/featured');
        },

        async getById(id) {
            return api.request(`/products/${id}`);
        },

        async getCategories() {
            return api.request('/products/categories');
        }
    },

    cart: {
        async get() {
            return api.request('/cart');
        },

        async add(productId, quantity = 1) {
            return api.request('/cart/add', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity })
            });
        },

        async update(productId, quantity) {
            return api.request('/cart/update', {
                method: 'PUT',
                body: JSON.stringify({ productId, quantity })
            });
        },

        async remove(productId) {
            return api.request(`/cart/remove/${productId}`, {
                method: 'DELETE'
            });
        },

        async clear() {
            return api.request('/cart/clear', {
                method: 'DELETE'
            });
        }
    },

    wishlist: {
        async get() {
            return api.request('/wishlist');
        },

        async add(productId) {
            return api.request(`/wishlist/add/${productId}`, {
                method: 'POST'
            });
        },

        async remove(productId) {
            return api.request(`/wishlist/remove/${productId}`, {
                method: 'DELETE'
            });
        },

        async clear() {
            return api.request('/wishlist/clear', {
                method: 'DELETE'
            });
        }
    },

    orders: {
        async create(orderData) {
            return api.request('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
        },

        async getAll() {
            return api.request('/orders/my-orders');
        },

        async getById(id) {
            return api.request(`/orders/${id}`);
        }
    },

    customBuild: {
        async submit(data) {
            return api.request('/custom-build', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        async getMyRequests() {
            return api.request('/custom-build/my-requests');
        }
    },

    newsletter: {
        async subscribe(email) {
            return api.request('/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        }
    },

    coupons: {
        async validate(code, subtotal) {
            return api.request('/coupons/validate', {
                method: 'POST',
                body: JSON.stringify({ code, subtotal })
            });
        }
    },

    reviews: {
        async getForProduct(productId, page = 1) {
            return api.request(`/reviews/product/${productId}?page=${page}&limit=10`);
        },

        async getMyReviews() {
            return api.request('/reviews/my-reviews');
        },

        async create(productId, rating, comment) {
            return api.request('/reviews', {
                method: 'POST',
                body: JSON.stringify({ productId, rating, comment })
            });
        },

        async update(reviewId, rating, comment) {
            return api.request(`/reviews/${reviewId}`, {
                method: 'PUT',
                body: JSON.stringify({ rating, comment })
            });
        },

        async delete(reviewId) {
            return api.request(`/reviews/${reviewId}`, {
                method: 'DELETE'
            });
        }
    },

    payment: {
        async createOrder(amount, orderId) {
            return api.request('/payment/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount, orderId })
            });
        },

        async verify(razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId) {
            return api.request('/payment/verify', {
                method: 'POST',
                body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId })
            });
        }
    },

    upload: {
        async image(file) {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api.token}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }
            return data;
        },

        async images(files) {
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            const response = await fetch(`${API_BASE}/upload/multiple`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api.token}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }
            return data;
        }
    }
};

window.api = api;
export default api;
