import api from './api.js';

const wishlist = {
    items: [],

    sync() {
        this.items = JSON.parse(localStorage.getItem('wishlist')) || [];
    },

    has(productId) {
        return this.items.some(item => item.id === productId);
    },

    add(product) {
        if (!this.has(product.id)) {
            this.items.push({ ...product });
            localStorage.setItem('wishlist', JSON.stringify(this.items));
            this.updateBadge();

            // Sync to server if logged in
            if (api.isAuthenticated()) {
                api.wishlist.add(product.id).catch(() => {});
            }
            return true;
        }
        return false;
    },

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(this.items));
        this.updateBadge();

        // Sync to server if logged in
        if (api.isAuthenticated()) {
            api.wishlist.remove(productId).catch(() => {});
        }
    },

    getCount() {
        return this.items.length;
    },

    getItems() {
        return [...this.items];
    },

    clear() {
        this.items = [];
        localStorage.removeItem('wishlist');
        this.updateBadge();

        // Clear on server if logged in
        if (api.isAuthenticated()) {
            api.wishlist.clear().catch(() => {});
        }
    },

    updateBadge() {
        const badges = document.querySelectorAll('.wishlist-badge');
        const count = this.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    async init() {
        this.sync();

        // If logged in, sync with server wishlist
        if (api.isAuthenticated()) {
            try {
                const { data } = await api.wishlist.get();
                // Merge server wishlist with local
                data.forEach(product => {
                    if (!this.has(product._id)) {
                        this.items.push({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image
                        });
                    }
                });
                localStorage.setItem('wishlist', JSON.stringify(this.items));
            } catch (error) {
                // Silent fail - wishlist will use local state
            }
        }

        this.updateBadge();
    }
};

export { wishlist };
