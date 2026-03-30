import api from './api.js';

const cart = {
    items: [],
    subtotal: 0,
    
    async sync() {
        if (!api.isAuthenticated()) {
            this.items = JSON.parse(localStorage.getItem('cart')) || [];
            this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return;
        }

        try {
            // Get localStorage cart before fetching server
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];

            const data = await api.cart.get();
            const serverItems = data.data.items.map(item => ({
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                quantity: item.quantity
            }));

            // Merge local and server carts (dedupe by productId)
            const mergedItems = [...serverItems];
            const itemsToSyncToServer = [];

            for (const localItem of localCart) {
                const exists = mergedItems.find(m => m.id === localItem.id);
                if (!exists) {
                    mergedItems.push(localItem);
                    itemsToSyncToServer.push({ id: localItem.id, quantity: localItem.quantity });
                } else {
                    // If item exists, keep higher quantity
                    if (localItem.quantity > exists.quantity) {
                        exists.quantity = localItem.quantity;
                        itemsToSyncToServer.push({ id: localItem.id, quantity: localItem.quantity });
                    }
                }
            }

            // Sync all items to server first (parallel)
            await Promise.allSettled(
                itemsToSyncToServer.map(item =>
                    api.cart.add(item.id, item.quantity).catch(() => {})
                )
            );

            this.items = mergedItems;
            this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Clear localStorage after successful sync (server is source of truth for logged-in users)
            localStorage.removeItem('cart');

        } catch (error) {
            // Silent fail - cart will use local state
            this.items = [];
            this.subtotal = 0;
        }
    },

    async add(product) {
        if (!api.isAuthenticated()) {
            const existing = this.items.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.updateBadge();
            return;
        }
        
        try {
            await api.cart.add(product.id, 1);
            await this.sync();
            this.updateBadge();
        } catch (error) {
            alert(error.message);
        }
    },
    
    async remove(productId) {
        if (!api.isAuthenticated()) {
            this.items = this.items.filter(item => item.id !== productId);
            this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.updateBadge();
            return;
        }
        
        try {
            await api.cart.remove(productId);
            await this.sync();
            this.updateBadge();
        } catch (error) {
            alert(error.message);
        }
    },
    
    async updateQuantity(productId, quantity) {
        if (!api.isAuthenticated()) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(1, quantity);
                this.subtotal = this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
                localStorage.setItem('cart', JSON.stringify(this.items));
            }
            return;
        }
        
        try {
            await api.cart.update(productId, quantity);
            await this.sync();
        } catch (error) {
            alert(error.message);
        }
    },
    
    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    getTotal() {
        return this.subtotal;
    },
    
    async clear() {
        if (!api.isAuthenticated()) {
            this.items = [];
            this.subtotal = 0;
            localStorage.removeItem('cart');
            this.updateBadge();
            return;
        }
        
        try {
            await api.cart.clear();
            await this.sync();
            this.updateBadge();
        } catch (error) {
            alert(error.message);
        }
    },
    
    updateBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },
    
    async init() {
        await this.sync();
        this.updateBadge();
    }
};

window.showToast = function(message) {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'cart-toast fixed bottom-4 right-4 bg-brand-dark text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    toast.style.animation = 'fadeIn 0.3s ease';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
};

document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});

// Make cart available globally for logout handler
window.cart = cart;

export { cart };
