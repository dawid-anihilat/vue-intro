Vue.component('product', {
    props:{
      premium: {
          type: Boolean,
          required: true
      }
    },

    template: `
    <div class="product">
    <div class="product-image">
        <a v-bind:href="url">
        <img v-bind:src="image" alt="">
        </a>
    </div>
    <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inventory > 10">In stock</p>
        <p v-else-if="inventory<=10 && inventory >0">Almost sold out!</p>
        <p v-else
            :class="{testtag: !inventory}">
            Out of stock
        </p>
        <p>Shipping: {{shipping}}</p>
        <p v-show="onSale">On Sale!</p>
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
        <div v-for="(variant, index) in variants" 
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor}"
            @mouseover="updateProduct(index)">
        </div>
        <div v-for="size in sizes">
            <p>{{ size }}</p>
        </div>
        <button v-on:click="addToCart"
            :disabled="!inventory"
            :class="{ disabledButton: !inventory}">
            Add to Cart
        </button>
        <button @click="removeFromCart">Remove from cart</button>
    </div>
    <product-tabs :reviews="reviews"></product-tabs>
    <product-review @review-submitted="addReview"></product-review>
    </div>
    `,
    data() {
        return {
            brand: 'Vue Master',
            product: 'Socks',
            selectedVariant: 0,
            url: 'https://www.google.com',
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2800,
                    variantColor: "green",
                    variantImage: "assets/socks-green.png",
                    variantQuantity: 10,
                    variantOnSale: true
                }, {
                    variantId: 9000,
                    variantColor: "blue",
                    variantImage: "assets/socks-blue.png",
                    variantQuantity: 0,
                    variantOnSale: false
                }
            ],
            sizes: ["small", "medium", "xl"],
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
            console.log(index)
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart',this.variants[this.selectedVariant].variantId)
        },
        addReview(productReview){
            this.reviews.push(productReview)
        }
        
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inventory() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        onSale() {
            return this.variants[this.selectedVariant].variantOnSale
        },
        shipping() {
            if (this.premium){
                return "Free"
            }else{
                return "2.99"
            }
        }
    }

})

Vue.component('product-detail',{
    props:{
        details: {
            type: String,
            required: false
        }
      },
    template: `
    <div class="product-detail">
        <h2>Product detail</h2>
        <p>{{details}}</p>
    </div>
    `,
})
Vue.component('product-review',{
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        <b> Please correct the following error(s):</b>
        <ul>
        <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review" ></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>Would you recommend this product?</p>
      <label> Yes
        <input type="radio" value="Yes" v-model="recommend"/>
    </label>
    <label> No
        <input type="radio" value="No" v-model="recommend"/>
        </label>
      

      <p>
        <input type="submit" value="Submit">
      </p>    
    
    </form>
    `,
    data() {
        return{
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },methods:{
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                  }
                  this.$emit('review-submitted', productReview)
                  this.name = null
                  this.review = null
                  this.rating = null
                  this.recommend = null
            }
            else{
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommendation review required.")
            }
          }
    }
})

Vue.component('product-tabs',{
    props: {
        reviews: {
          type: Array,
          required: false
        }
      },
    template: `
        <div>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab">
                {{ tab }}
            </span>
        </div>
        <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews</p>
        <ul v-else>
        <li v-for="(review, index) in reviews" :key="index">
          <p>{{ review.name }}</p>
          <p>Rating:{{ review.rating }}</p>
          <p>{{ review.review }}</p>
          <p>{{ review.recommend }}</p>
        </li>
    </ul>
    </div>
    <div v-show="selectedTab === 'Make a Review'">
    <product-review @review-submitted="addReview"></product-review>        
  </div>

    `,data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
       premium: false,
       details: "Nice socks! Yeah",
       cart: []
    },
    methods:{
        updateCart: function (id) {
            this.cart.push(id)
        },
        updateToRemoveFromCart: function (id) {
            this.cart.pop(id)
        }
    }
})