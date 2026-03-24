import{t as e}from"./cart-JCPD7Io_.js";function t(){let n=document.getElementById(`cartItems`),r=document.getElementById(`emptyCart`),i=document.getElementById(`cartSummary`),a=document.getElementById(`subtotal`),o=document.getElementById(`total`);if(e.items.length===0){n.innerHTML=``,r.classList.remove(`hidden`),i.classList.add(`hidden`);return}r.classList.add(`hidden`),i.classList.remove(`hidden`),n.innerHTML=e.items.map(e=>`
                <div class="bg-white rounded-2xl p-4 shadow-soft flex items-center gap-4">
                    <img src="${e.image}" alt="${e.name}" class="w-24 h-24 object-cover rounded-xl">
                    <div class="flex-1">
                        <h3 class="font-bold text-brand-dark">${e.name}</h3>
                        <p class="text-gray-500">$${e.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="quantity-btn w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100" data-id="${e.id}" data-action="decrease">
                            <i class="fa-solid fa-minus text-xs"></i>
                        </button>
                        <span class="w-8 text-center font-medium">${e.quantity}</span>
                        <button class="quantity-btn w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100" data-id="${e.id}" data-action="increase">
                            <i class="fa-solid fa-plus text-xs"></i>
                        </button>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-brand-dark">$${(e.price*e.quantity).toFixed(2)}</p>
                        <button class="remove-btn text-gray-400 hover:text-red-500 text-sm mt-1" data-id="${e.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join(``),a.textContent=`$${e.getTotal().toFixed(2)}`,o.textContent=`$${e.getTotal().toFixed(2)}`,document.querySelectorAll(`.quantity-btn`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.dataset.id,i=n.dataset.action,a=e.items.find(e=>e.id===r);a&&(i===`increase`?a.quantity+=1:a.quantity=Math.max(1,a.quantity-1),e.save(),e.updateBadge(),t())})}),document.querySelectorAll(`.remove-btn`).forEach(n=>{n.addEventListener(`click`,()=>{e.remove(n.dataset.id),t()})}),document.getElementById(`clearCartBtn`).addEventListener(`click`,()=>{e.clear(),t()}),document.getElementById(`checkoutBtn`).addEventListener(`click`,()=>{alert(`Checkout functionality coming soon!`)})}document.addEventListener(`DOMContentLoaded`,()=>{t()});