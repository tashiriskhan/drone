const cart = {
    items: JSON.parse(localStorage.getItem('cart')) || [],
    
    add(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
        this.updateBadge();
    },
    
    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateBadge();
    },
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
        }
    },
    
    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    updateBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        });
    },
    
    clear() {
        this.items = [];
        this.save();
        this.updateBadge();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cart.updateBadge();
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };
            cart.add(product);
        });
    });
});
